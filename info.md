## TODO:
- asi nechcem vidiet preprusenia pri celodnovych nepracovnych dnoch
- niektore celodnove typy dna sa mi zobrazuju bez casu ako NV nema 7,5 pre mobil a niektore s casom aj ked je to volno...


## Refactor:
-- kalkulacny process nie je uplne jasny a je tazsie citatelny

## Chyby:
1) **TEST READY** "Iny den" zapocitava cely cas aj s obedom, bud opravit kalkulaciu alebo dorobit toggle pre obed a ak je zapnuty tak sa odrata pol hodina, cas zaciatku a konca je potrebne nezmenit lebo sa musi dostat do exportu spravne
2) "Iny den" v Exceli je len v jednom stlpci a nie dvoch ako ostatne typy dna
3) **TEST READY** ak mam "iny den" kde pracujem od 8:30 do 15:30 - teda mam obed a tu jednu hodinu beriem ako NV tak sa to zle pocita s obedom v Exceli. Dostanem tam 8h aj ked by som mal mat 7... ci to nie je dovod chyby 1)
4) "Iny den" - ak oskrtnem a zaskrtnem pracovny cas tak nedostanem spravne spocitany obed
5) "Iny den" - ak si dam pcko tak sa obed uz nerata spravne, P=cko 9:30 - 11:30 ma mat obed ale do 12:30 uz nie

- ak dam pracu s P-ckom 9:30 az 11:30 tak ci dostanem rovnaky vysledok ako ked to iste spravim cez iny den

- potrebujem doplnit nejak ucast/sprievod na sutaziach kde potrebujem aj meno sutaze ("MO Kosice", alebo "sutaz Presov"). Mohlo by to by v inom dni podobne ako P-cko ale zobrazilo by sa aj policko na nazov sutaze a neviem kde sa to zapise ak by ucitel bol cast dna tam a cast dna v skole.

- "iny den" - potebujem mat odpracovane ako editovatelny cas s pol hod. krokom a obed volitelnym s checkboxom a moznostou inputu s nazvom dna. odpracovany cas sa nepreratava automaticky, a ani obed sa nemoze lebo ak bol prec ale pracoval viac ako 6 tak ma narok ale mozno nemal prestavku


- TODOMB este opravit WorkDayForm.tsx aby po otvoreni sa vsetko neprepocitalo, lebo to prepise niektore hodnoty ktore su v inputoch 