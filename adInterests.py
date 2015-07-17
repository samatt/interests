import csv
from urllib2 import Request, urlopen,quote
import json
token = "CAAI4BG12pyIBAJHkZCmT3EAkVP1JBrcX5cNgHRrTyy3pRUgaq5uIRSFhavEDS194mzQLGqZAZAkLVoJCZBZBL6rhijeNOqOoCaeuYOv1UDVHwdotukGwBqZBe5dYWcsZBtIrTvUw6aDEZAjU7WI7GLzBbdb8TE7LlD90PgsT9tMZCRUWZB5llkqVkcAJiRI7ZBVY86GxIIvxwtIB1EzsnKOqhBL"

# words = ['global warming',"commmunism","marx"]
q = open("noun_phrases1.txt")

words = q.read().split("\n")
queries = {}
for word in words:
	word = quote(word)
	query = "https://graph.facebook.com/v2.3/search?access_token="+token+"&callback=__globalCallbacks.f25a07e41c&endpoint=%2Fsearch&locale=en_GB&method=get&pretty=0&q="+word+"&type=adInterest"
	response = urlopen(query).read()
	response = response.replace("/**/ __globalCallbacks.f25a07e41c(","")
	response = response.replace(");","")
	j =  json.loads(response)

	try:
		interests =  j['data']
		queries[word] = []
		for i in interests:
			print i
			queries[word].append(i)
	except Exception, e:
		print e
		pass
	

with open('interests.json', 'w') as outfile:
    json.dump(queries, outfile,indent=4, sort_keys=True)
	# print response