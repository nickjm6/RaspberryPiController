import sys

filename = sys.argv[1]
password = sys.argv[2]

file = open(filename, 'r')
myPass = file.read().strip()
file.close()

if password == myPass:
	print 1
else:
	print 0