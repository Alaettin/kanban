# Anleitung Python-basierte Schnittstelle für die automatisierten Kalibrierung einer Simulationsumgebung


## Installation
- Die Anwendung wurde unter Verwendung von Python 3.11 entwickelt. Für die Ausführung werden bestimmte Python-Pakete installierbar mittels ``pip`` Manager benötigt. 
- Es wird empfohlen, eine virtuelle Umgebung für die Python Paketverwaltung mittels ``python3.11 -m venv venv`` zu erstellen.
- Die virtuelle Umgebung wird folgendermaßen aktiviert: ``venv\Scripts\activate.bat``
- Anschließend können die Pakete per ``pip install -r requirements.txt`` installiert werden.

## Java Einrichtung
Für die Ausführung der Simulations Engine wird eine funktionierendes Java Development Kit benötigt. Die Ausführung wurde unter Windows 10 mit Java 17 gemeinsam im Termin vom 19.05.2025 getestet:

- Download Übersicht: https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html
- Download Link: https://download.oracle.com/java/17/archive/jdk-17.0.12_windows-x64_bin.zip

Nach Extrahieren muss der Pfad zur Java-Executable unter ``cfg.py`` -> ``JAVA_PATH = r"PFAD_ZU\jdk-17.0.12_windows-x64_bin\jdk-17.0.12\bin\java.exe"`` gesetzt werden.

## Simulationsumgebung
- Für AnyLogic kann die Simulation wie im Termin am 19.05.2025 in der AnyLogic Umgebung exportiert und die ``.jar`` Datei entpackt werden.
- Wichtig hierbei: Die Datenbank muss wie besprochen in dem Modell fest hinterlegt werden, da sonst bei der Ausführung konkurrierende Threads zu Fehlern führen können.
- Der Pfad zur entpackten ``.jar`` Datei muss in der ``cfg.py`` Datei unter ``MODEL_PATH = PFAD_ZU\model.jar`` angepasst werden.

## Parameter
Die Parameter für die Simulationskalibrierung sind in zwei Teile untergliedert:
1. Veränderbare Parameter: Diese werden in der Datei ``cfg.py`` angelegt. Das Schema der Parameter sieht wiefolgt aus:
    - ``"MaterialOrderDelay": ParamTransform(bounds=[0.1, 0.9]),``
    wobei ``ParamTransform`` eine Klasse ist, welche den Raum der möglichen Parameterwerte abbildet der mit den Grenzen ``bounds=[0.1, 0.9]`` angepasst werden kann.
    - Standardmäßig sind die Parameter als Gleitkommazahl angegeben, um Ganzzahlen zu erzeugen kann eine Python Funktion zur Anpassung der Ausgabeparameter mittels ``"LagerLimit": ParamTransform(int, bounds=[10000, 300000]),`` angegeben werden.
2. Standardwerte der Parameter: werden in einer ``.json`` Datei wie bspw. der ``cfg_default.json`` hinterlegt als Dictionary mit bspw. ``"LagerLimit": 231391,``. Diese werden für Parameter verwendet, welche nicht unter Punkt 1 angelegt wurden.

## Loss Funktion zur Optimierung
Die Loss-Funktion, welche von dem Algorithmus minimiert wird, muss in der Datei ``cfg.py`` unter ``LOSS_FN = ...`` hinterlegt werden. Der Loss-Funktion als native Python-Funktion oder ``lambda``-Funktion wird als Argument der Endzustand der ausgeführten Simulation übergeben, aus welchem daraufhin die Zielgröße beispielsweise mittels 

```
LOSS_FN = lambda sim: sim.outputs("_ds_AkkumProd")[0].y_values[-1]
```

für die Optimierung der Akkumulierten Produktivität im Stock ``AkkumProd`` extrahiert werden kann.

## Ausführung des Trainings in python
Die Eintrittsdatei zur Ausführung der Code-Basis ist die ``main.py``. Hier können verschiedene Argumente eingegeben werden, welche durch den Befehl ``python main.py --help`` erklärt werden:

```
> python main.py --help
usage: main.py [-h] [-c CFG_PATH] [-o OUT_PATH] [-n NAME] [-i ITER] [-t THREADS] ...

Bayesion optimization of AL model script

options:
  -h, --help            show this help message and exit
  -c CFG_PATH, --cfg_path CFG_PATH
                        path to default cfg (i.e., parameters that won't be optimized)
  -o OUT_PATH, --out_path OUT_PATH
                        output path
  -n NAME, --name NAME  optional name of run
  -i ITER, --iter ITER  number of iterations to optimize
  -t THREADS, --threads THREADS
                        number of threads to use (i.e., 8)

positional arguments:
  opts                  Modify config using the command-line
```

Das Training kann durch bspw. den Befehl

```
python main.py -c cfg_default.json -t 8
```

mit 8 Threads zur Simulationsausführung gestartet werden. Die Anzahl der Threads sollte die Anzahl der Prozessoren im PC nicht übersteigen.

## Auswertung
Das laufende Training kann über eine Tensorboard-Schnittstelle mit jedem Browser kompatibel beobachtet werden. Dazu kann innerhalb des Python Environments ``tensorboard --logdir=out`` aufgerufen werden und standardmäßig unter ``http://localhost:6006/`` in der Übersicht ``Scalars`` die Optimierung betrachtet werden.

Die Trainingsergebnisse werden in einem neu angelegten Ordner standardmäßig unter ``out\DATUM_UHRZEIT_NAME`` abgelegt. In diesem befinden sich:
- ``al_opt_transformed.csv``: Die Übersichtsdatei im angeforderten ``.csv`` Format zur einfachen Auswertung via Excel
- ``al_opt.json``: Ein anderes Format der Trainingsergebnisse welche für die Fortsetzung des Trainings verwendet werden kann (siehe unten)
- ``events.out.tfevents.XXX``: Eine Log-Datei welche für das Live-Logging via ``tensorboard`` erstellt wird
- ``sim_settings.json``: Eine Kopie der Default-Werte der Parameter und weiterer Trainingseigenschaften

## Fortsetzung eines Trainings

Für die Fortsetzung eines Trainings müssen in der ``main.py`` Datei die Zeilen ``71 & 72`` (mit Kommentar markiert) auskommentiert werden. 

Wichtig: nur Trainings mit exakt derselben Konfiguration können fortgesetzt werden, es sind keine Änderungen möglich. Daher müssen die Auswertungs-Logs auf welche aufgebaut wird in einem separaten Ordner bspw. ``training_fortsetzung`` abgelegt und die Fortsetzung des Trainings mittels ``python main.py ... -o training_fortsetzung`` gestartet werden.

## Weiteres
- In dem Ordner ``utils`` sind mehrere Varianten (single-threaded, multi-threaded mittels ``ray`` und multi-threaded nativ) für die Simulationsausführung hinterlegt. Nach den gemeinsamen Tests Anfang August hat sich ja die multi-threaded nativ als beste Variante herausgestellt - die beiden anderen sind nach wie vor hinterlegt für mögliche zukünftige (Weiter-)Entwicklungen.