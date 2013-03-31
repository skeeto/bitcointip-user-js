JS = header.js changelog.js res.js bitcointip.js footer.js

bitcointip.user.js : $(JS)
	  cat $^ > $@

changelog.js : changelog.md
	sed -e "1i\\\n\/* ## ChangeLog" \
	    -e 's/^/ */' \
	    -e "\$$s/\$$/\n *\/\n/" $< > $@

.PHONY : clean

clean :
	$(RM) bitcointip.user.js changelog.js
