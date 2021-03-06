#!/usr/bin/env python
# -*- coding: utf-8 -*-

import app.utils
import argparse
import dbutils
import pymongo
import re
import scraper

from xml.etree.ElementTree import iterparse
from datetime              import datetime

# Set up an arg parser
parser = argparse.ArgumentParser()
parser.add_argument("lang")

# Parse the arguments
args = parser.parse_args()

# Connect to the DB
db = dbutils.DBConnect()
coll = db["translations_%s" % args.lang]
coll.remove({})
coll.create_index([('base', pymongo.ASCENDING)])


def u_join(sep, xs):
	s = u""
	for x in xs:
		if type(x) != type(u''):
			x = unicode(x, 'utf-8')
		s = "%s%s%s" % (s, sep, x)
	return s[1:]


def convert_pinyin(s):
	try:
		a = s[0:-1]
		n = int(s[-1])
	except:
		return None
	i = -1
	if 'a' in a or 'e' in a:
		i = a.find('a')
		if not i >= 0:
			i = a.find('e')
	elif 'ou' in a:
		i = a.find('ou') + 1
	else:
		i = max(a.find('i'), a.find('o'), a.find('u'))

	left = a[:i]
	right =  a[i+1:] if i < len(a) - 1 else ''
	m = a[i:i+1]

	if n == 1:
		m = m.replace('a', 'ā')
		m = m.replace('e', 'ē')    
		m = m.replace('i', 'ī')
		m = m.replace('o', 'ō')
		m = m.replace('u', 'ū')
	if n == 2:
		m = m.replace('a', 'á')
		m = m.replace('e', 'é')
		m = m.replace('i', 'í')
		m = m.replace('o', 'ó')
		m = m.replace('u', 'ú')
	if n == 3:
		m = m.replace('a', 'ǎ')
		m = m.replace('e', 'ě')    
		m = m.replace('i', 'ǐ')
		m = m.replace('o', 'ǒ')
		m = m.replace('u', 'ǔ')
	if n == 4:
		m = m.replace('a', 'à')
		m = m.replace('e', 'è')
		m = m.replace('i', 'ì')
		m = m.replace('o', 'ò')
		m = m.replace('u', 'ù')

	return "%s%s%s" % (left, m, right)

count = 0


f_in = open('/data/dictionaries/cedict.txt')
for line in f_in.readlines():
	is_def_line = '/' in line and '[' in line and ']' in line
	if is_def_line:
		line = line.strip()

		# Get base
		parts = line.split(' ')
		base = parts[1]

		# Get pron
		i = line.find('[')
		j = line.find(']', i+1)
		pron_str = line[i+1:j]
		parts = pron_str.split(' ')
		pron = ''
		for part in parts:
			part = part.lower()
			part = convert_pinyin(part)
			if part:
				pron += part

		if type(pron) != type(u''):
			pron = unicode(pron, 'utf-8')

		# Get defs
		i = line.find('/')
		defs_str = line[i+1:len(line)-1]
		defs = defs_str.split('/')

		# Look for variant defs
		good_defs = {}
		for d in defs:
			if 'variant of' in d or 'CL:' in d:
				continue
			if pron not in good_defs.keys():
				good_defs[pron] = []
			good_defs[pron].append(d)

		if good_defs != {}:
			existing_entry = coll.find_one({'base': base})
			if existing_entry:
				for existing_pron in existing_entry['txs'].keys():
					if existing_pron not in good_defs.keys():
						good_defs[existing_pron] = []
					good_defs[existing_pron] += existing_entry['txs'][existing_pron]
				coll.update(
					{ 'base': base },
					{
						'base': base,
						'pron': u_join(u"/", good_defs.keys()),
						'txs': good_defs
					}
				)
			else:
				coll.insert(
					{
						'base': base,
						'pron': good_defs.keys()[0],
						'txs': good_defs
					}
				)

		count += 1
		print "%d/%d" % (count, 113386)

