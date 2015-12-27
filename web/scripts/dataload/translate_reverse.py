import argparse
import dbutils, perf
import time
from pprint import pprint

from translations import pooled_translate
from word_lists import get_word_list, print_pricing_info


def main():
	parser = argparse.ArgumentParser()
	parser.add_argument('--host', default='glossify.io',
		help='server name where the database lives')
	parser.add_argument('--lang',
		help='2-character language code')
	parser.add_argument('--limit', default=10, type=int,
		help='2-character language code')
	args = parser.parse_args()

	# Get the words
	print "Getting words"
	word_list = get_word_list('en', limit=args.limit if args.limit else None)
	print_pricing_info(word_list)

	# Connect to DB
	print "Connecting to DB"
	db = dbutils.DBConnect(args.host, 'tlemberg', 'tlemberg')
	coll_name = "word_list_%s_reverse" % args.lang
	coll = db[coll_name]

	print "Removing documents"
	coll.remove({})

	print "Translating"
	buf = dbutils.DBWriteBuffer(coll)
	progress = perf.ProgressDisplay(len(word_list))
	for word_list_chunk in dbutils.chunk_list(word_list, 100):
		tx_dict = pooled_translate([tup[0] for tup in word_list_chunk], 'en', args.lang)
		for (word, count) in word_list_chunk:
			tx = tx_dict[word]
			buf.append({
				'word': word,
				'count': count,
				'tx': tx,
			})
			progress.advance(1)
	buf.flush()


if __name__ == "__main__":
	main()