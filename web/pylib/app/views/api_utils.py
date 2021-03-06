# -*- coding: utf-8 -*-
import re
from app.appconfig     import app_instance, mongo

def segment_doc(text, lang):
	text = text.replace('\n', ' ').replace('\t', '');
	# Non greek full stops
	full_stop = {
		'zh' : u'。',
		'jp' : u'。'
	}
	if lang in full_stop.keys():
		return text.split(full_stop[lang])
	# For all greet languages, split on one-word stop to avoid abbr periods.
	return text.split('. ')

# Old Code, no longer used
def excerpt_to_phrase_ids(text, lang, known_phrases):
	coll = mongo.db["phrases_%s" % lang]
	phrase_id_map = {}
	if lang == 'zh':
		# for chinese, interested in multi-character phrases
		for phrase_size in xrange(1,5):
			for i in xrange(0, len(text)-phrase_size+1):
				j = i + phrase_size
				phrase = text[i:j]
				phrase_id = coll.find_one({'base': phrase, 'txs': {'$exists': 1}}, {'_id': 1})
				if phrase_id:
					phrase_id_map[phrase] = phrase_id['_id']
		# if a character is in a phrase, then remove character definition
		for phrase in phrase_id_map.keys():
			if len(phrase) > 1:
				for c in phrase:
					if c in phrase_id_map:
						del phrase_id_map[c]
	else:
		for phrase in text.split(' '):
			norm_phrase = normalize(phrase, lang)
			phrase_id_map[norm_phrase] = None
			if norm_phrase not in known_phrases:
				phrase_id = coll.find_one({'base': norm_phrase, 'txs': {'$exists': 1}}, {'_id': 1})
				if phrase_id:
					phrase_id_map[norm_phrase] = phrase_id['_id']
			else: phrase_id_map[norm_phrase] = known_phrases[norm_phrase]
	return phrase_id_map


def normalize(word, lang):
	# currently ignoring language

	# Use Regex
	lower_word = word.lower()
	pattern=re.compile(u'[^\w+\']', re.UNICODE)
	normalized_words = pattern.sub(' ', lower_word, re.UNICODE).split(' ')

	if lang == 'fr': # handle french abbrvs
		for word in normalized_words:
			if '\'' in word:
				normalized_words.remove(word)
				normalized_words.append(max(word.split('\''), key=lambda p: len(p)))
	return normalized_words

	# return word # Without normalization, average hit rate is <10% lower

def sentence_to_phrases(text, lang):
	if lang == 'fr':
		# return [normalize(word, lang) for word in text.split(' ')]
		phrases = []
		for word in text.split(' '):
			phrases += normalize(word, lang)
		return [ph for ph in phrases if (ph.strip() and not ph.isdigit())]
	if lang == 'zh':
		# for chinese, interested in multi-character phrases
		phrases = []
		for phrase_size in xrange(1,5):
			for i in xrange(0, len(text)-phrase_size+1):
				j = i + phrase_size
				phrases.append(text[i:j])
		return phrases
				
def get_phrases_from_excerpts(excerpts, lang):
	unique_phrases = set()
	phrase_lists = []
	for excerpt in excerpts:
		phrases = sentence_to_phrases(excerpt, lang)
		phrase_lists.append(phrases)
		unique_phrases |= set(phrases)
	return phrase_lists, unique_phrases

def get_phrase_ids(phrases, lang):
	# construct a single query
	coll = mongo.db["phrases_%s" % lang]
	or_clause = [{"base": ph} for ph in list(phrases)]
	cursor = coll.find({"$or": or_clause})

	phrase_id_map = dict((key, None) for key in list(phrases))
	for d in cursor:
		phrase_id_map[d['base']] = d['_id']
		
	return phrase_id_map



