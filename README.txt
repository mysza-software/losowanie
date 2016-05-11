Program losuj¹cy

-----------------------------------------------------------------------------------------------------------------

Opis
Program korzysta z bazy danych MySQL, w której utowrzona jest (przez administratora) lista osób mog¹cych losowaæ.
Po zalogowaniu osoby losuj¹cej przypisywana jest wylosowana osoba z puli osób jeszcze nie wylosowanych. 
Ka¿dy mo¿e raz losowaæ oraz byæ raz wylosowany. Baza danych jest aktualizowana o informacje
czy dana osoba losowa³a i kogo wylosowa³a.

-----------------------------------------------------------------------------------------------------------------

Program wykonuje siê w trzech etapach:
1. Logowanie u¿ytkownika i wys³anie informacji do bazy danych, ¿e dana osoba bierze udzia³ w losowaniu.
2. Przejœcie do losowanie i losowanie
3. Wyœwietlenie osoby wylosowanej u¿ytkownikowi oraz przypisanie w bazie danych numeru id osoby wylosowanej 
do osoby losuj¹cej

----------------------------------------------------------------------------------------------------------------
Zaczynamy pracê przez odpalenie programu w œrodowisku node.js
Adres aplikacji: http://127.0.0.1:80
 