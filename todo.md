
# TODO:
- update angular to last 18 version
- update primeng to 18 version
- use new angular templates directives (@if, @let, @for ...) + input signals + all components on push


## Known issues
- selected day must be in store : if month changes, but not slected day, it disapear from view.
- deletion bug on change date. Reproduction: 
    * Add an activity
    * delete it
    * change month
    * go back : activity not deleted

