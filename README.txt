Program losuj�cy

-----------------------------------------------------------------------------------------------------------------

Opis
Program korzysta z bazy danych MySQL, w kt�rej utowrzona jest (przez administratora) lista os�b mog�cych losowa�.
Po zalogowaniu osoby losuj�cej przypisywana jest wylosowana osoba z puli os�b jeszcze nie wylosowanych. 
Ka�dy mo�e raz losowa� oraz by� raz wylosowany. Baza danych jest aktualizowana o informacje
czy dana osoba losowa�a i kogo wylosowa�a.

-----------------------------------------------------------------------------------------------------------------

Program wykonuje si� w trzech etapach:
1. Logowanie u�ytkownika i wys�anie informacji do bazy danych, �e dana osoba bierze udzia� w losowaniu.
2. Przej�cie do losowanie i losowanie
3. Wy�wietlenie osoby wylosowanej u�ytkownikowi oraz przypisanie w bazie danych numeru id osoby wylosowanej 
do osoby losuj�cej

----------------------------------------------------------------------------------------------------------------
Zaczynamy prac� przez odpalenie programu w �rodowisku node.js
Adres aplikacji: http://127.0.0.1:80
 