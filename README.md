# Abschlussprojekt

Projektbeschreibung

Lernapp / Quiz
Flaggen + Länder aller Welt

Willkommensseite:
Passendes Favicon
Buttons (Spiel starten, Anleitung, Beenden)

Anleitung: Spielanleitung
Beenden = schließen des Fensters / der Seite / des Tabs / des Browsers

Zu Beginn muss der User einen Usernamen eingeben (egal, welchen)

Es gibt einen div-Container, in dem die Flaggen aus dem Server random geladen und angezeigt werden.

Es gibt ein input-Feld, wo die richtige Lösung eingetragen wird und einen Submit Button.

Es gibt ein tip-Button, bei dem die richtige Lösung eingetragen wird. Dann gibt es aber keinen Punkt.

Es gibt einen kleinen Abbrechen Button, der zurück ins Hauptmenü führt, dann wird der Username nicht gespeichert und nichts ins Backend eingetragen.
Der User erhält ein Confirm ob er sich sicher ist

Beim CLick auf den Button, wird die Eingabe überprüft und mit der Lösung am Server verglichen.

Lösung korrekt: Input leuchtet grün (Bootstrap) und ein Punkt wird mitgezählt.
Danach nächstes Level (settimeout, x sek)

Lösung falsch: Input leuchtet rot (Bootstrap) und ein Punkt wird abgezogen (auch im Minusbereich).
Danach nächstes Level (settimeout, x sek)

Rechts oben erscheint ein Punktecounter.

Links oben erscheint ein Timer (settimeout) für ? Sekunden, wo die richtige Lösung geschickt werden muss.

Timer-Ablauf: Automatisch kein Punkt und nächstes Level.



Nach Ablauf aller Level =>

Punkteanzahl 1 oder mehr: Overlay (grün): du hast gewonnen.

Punkteanzahl 0 oder weniger (Minusbereich): Overlay (rot): du hast verloren.

Overlay Allgemein: Body dunkel, Schrift grün/rot + Buttons (Nochmal spielen, Hauptmenü, Bestenliste).



Ende des Spiels:

Username, timestamp + Punkteanzahl werden ins Backend gespeichert.

Bei abschließendem Overlay: Button mit bisherigen Spielern:
    ALLE bisherigen gespeicherten User/Spiele werden in einer Tabelle (3 Spalten) angezeigt
    (Punkte, Name, Datum), 
    sortiert nach dem besten Punkteergebnis
