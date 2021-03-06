def get_total_phrase_counts(db):

	# Get a cursor to all of the phrase count documents in the database
	phrase_counts = db.phrasecounts.find()

	# Iterate over the phrase count documents in the cursor
	count_map = {}
	for phrase_count in phrase_counts:

		# Adjust the count in the count map, creating an entry if necessary
		if phrase_count['phrase'] not in count_map:
			count_map[phrase_count['phrase']] = phrase_count
		else:
			count_map[phrase_count['phrase']]['count'] += phrase_count['count']

	# Grab the total phrase counts as a list and sort them
	total_phrase_counts = count_map.values()
	total_phrase_counts = sorted(total_phrase_counts, key=lambda phrase_count: phrase_count['count'], reverse=True)

	# Assign a rank to every phrase count in the list
	rank = 1
	for phrase_count in total_phrase_counts:
		phrase_count['rank'] = rank
		rank += 1

	return total_phrase_counts