# Concept 
Track multiple aspect of every days to make statistics :
- How many burgers/pint a month ?
- How do I feel ?
- How much money did I spent ?
- Did I eat out ? Did I cook ?

Idea : all is represented by an utf8 character (emoji or a letter) with a unit (if quantifiable), and a base quantity.

For example, if I want to track my beer consumption, I can set (🍺,'ml',25), so that I know that one emoji is a glass of beer.
On a day, if I had a party with friends and I got 2 pints, I'll have 4 beer emojis. But if i do love beer more than that, I can set it to 50ml without any problem !
For an emotion, or something less quantifiable, I can specify just an emoji, and the key is the emoji.

Example for a day :

09/03/2024:
🍔🚴‍♂️🚴‍♂️☕️☕️🍫🎹📖

That is a representation of a day : I ate a burger/fast food outside, I made had 8km bike, I got 2 coffees, on bar of choclate, I played piano for 30 minutes and I red 10 minutes.
This can be represented in a database like :
(🍔,"u",1) One unit of burger
(🚴‍♂️,"km",4) 4km of bike
(☕️,"u",1) 1 coffe cup unit
(🍫,"square","2") 2 square of chocolate
(🎹, "min", 30) 30 min of playing the piano
(📖, "min", 10) 10 min of reading

All activities are customizable, then I can have a "dashboard" where I can check statistics over a given period of time (day, week, month, year, n weeks, n months, n years etc...) with easily readable graphs or tables.

It has to be easy to fill every day, it may not take more than 30 seconds.

## Categories

* Quantifiable
we have a unit and a quantity to define (see before).
* Events
Something that just happends once, equivalent to (L, "u", 1) in quantifiable category
* Moods
Category that describe how you feel. 


## Scope R1
1) Authentication
2) Categories CRUD
3) Daily fill
4) raw statistics 

Stack : supabase + angular17 + github pages deploy