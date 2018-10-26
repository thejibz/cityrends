.PHONY : install push force_push

install:
	rm -f yarn.lock || true
	yarn install

start:
	yarn start

push:
	git add .
	git status
	git commit -m"[sync]"|| true 
	git push

force_push:
	git add .
	git status
	git commit -m"[sync]"|| true 
	git push -f
