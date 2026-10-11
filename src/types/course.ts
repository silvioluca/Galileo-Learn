/** Una singola coppia input -> output mostrata in un esercizio "trova la regola". */
export interface RuleOption {
  id: string;
  label: string;
  fn: (x: number) => number;
}

export interface RuleMatchingExercise {
  type: "rule-matching";
  id: string;
  prompt: string;
  inputs: number[];
  options: RuleOption[];
  correctId: string;
  explanation?: string;
}

/** Esercizio "modello ad area": lo studente trascina le tessere (quadrati/strisce)
 * per costruire il prodotto di due fattori algebrici, es. 2z(z + 1). */
export interface AlgebraTilesExercise {
  type: "algebra-tiles";
  id: string;
  prompt: string;
  /** lettera della variabile usata nell'esercizio, es. "z" o "x" */
  variable: string;
  /** coefficiente del fattore monomio, es. 2 in "2z" */
  coeffA: number;
  /** termine costante del secondo fattore, es. 1 in "(z + 1)" */
  constB: number;
  /** risultato in LaTeX per il pannello di riepilogo, es. "2z^2 + 2z" */
  resultLatex: string;
  explanation?: string;
}

export interface MultipleChoiceOption {
  id: string;
  label: string;
}

export interface MultipleChoiceExercise {
  type: "multiple-choice";
  id: string;
  prompt: string;
  choices: MultipleChoiceOption[];
  correctId: string;
  explanation?: string;
  /** Se presente, mostra un grafico con due curve sopra le opzioni di scelta:
   * usato per confronti tra funzioni date come testo (es. "quale decresce più
   * in fretta?"), dove le opzioni stesse sono le formule da confrontare. */
  compareGraph?: {
    maxDay: number;
    maxValue: number;
    yStep: number;
    seriesA: GrowthSeries;
    seriesB: GrowthSeries;
    axisLabel?: string;
    quantityLabel?: string;
  };
}

/** Un giorno mostrato in un esercizio "crescita esponenziale" (es. batteri che raddoppiano). */
export interface DayCount {
  day: number;
  value: number;
}

interface ExponentialDaysBase {
  id: string;
  prompt: string;
  /** i giorni mostrati con il loro valore reale (già noto/rivelato) */
  days: DayCount[];
  explanation?: string;
  /** etichetta singolare per i cerchi, es. "Giorno" o "Ora" (default "Giorno") */
  dayLabel?: string;
}

/** Lo studente indovina il valore del prossimo giorno tra alcune opzioni numeriche
 * o espressioni in LaTeX (es. "$3 \\cdot 2^{10}$"). */
export interface ExponentialChooseExercise extends ExponentialDaysBase {
  type: "exponential-days";
  mode: "choose";
  targetDay: number;
  choices: { id: string; label: string }[];
  correctId: string;
  /** valore reale da mostrare al posto di "?" una volta risolto */
  revealValue: number;
}

/** Lo studente trascina tessere numeriche in caselle ordinate per costruire
 * il prodotto che genera il valore del giorno mostrato (es. 3 · 2 · 2 = 12).
 * I giorni sono sempre visibili: l'incognita è solo il risultato dell'equazione.
 * Se `fixedPrefix` è presente, viene mostrato come valore noto già scritto
 * prima delle caselle (es. "500 · [] · [] = ?"), e `correctFactors` contiene
 * solo i fattori di crescita da trascinare (non il valore di partenza). */
export interface ExponentialBuildExercise extends ExponentialDaysBase {
  type: "exponential-days";
  mode: "build";
  correctFactors: number[];
  tileValues: number[];
  fixedPrefix?: number;
}

/** Schermata di riepilogo non interattiva: ripropone la stessa figura per
 * fissare il concetto (crescita esponenziale) con una formula e un testo. */
export interface ExponentialConceptExercise extends ExponentialDaysBase {
  type: "exponential-days";
  mode: "concept";
  formula: string;
  conceptText: string;
}

export type ExponentialDaysExercise =
  | ExponentialChooseExercise
  | ExponentialBuildExercise
  | ExponentialConceptExercise;

interface GraphPointBase {
  id: string;
  prompt: string;
  /** giorni massimi/valore massimo rappresentati sugli assi del grafico */
  maxDay: number;
  maxValue: number;
  /** passo delle linee guida sull'asse verticale */
  yStep: number;
  /** passo delle etichette sull'asse orizzontale (default 1): da aumentare
   * quando `maxDay` è grande, per evitare etichette sovrapposte. */
  xStep?: number;
  /** valore minimo (eventualmente negativo) rappresentato sull'asse orizzontale
   * (default 0): usato per i grafici che si estendono a sinistra dello zero. */
  minDay?: number;
  explanation?: string;
  /** etichetta singolare per il cerchio accanto al grafico, es. "Giorno" o "Ora" (default "Giorno") */
  dayLabel?: string;
  /** etichetta dell'asse orizzontale, es. "Giorni" o "Ore" (default "Giorni") */
  axisLabel?: string;
  /** etichetta dell'asse verticale, es. "Batteri" o "Cellule" (default "Batteri") */
  quantityLabel?: string;
}

/** Lo studente trascina verticalmente un punto fino al valore corretto per il
 * giorno target, su un grafico giorni/quantità con i punti già noti fissi.
 * `coeff`/`base` descrivono la vera funzione $y = \text{coeff} \cdot \text{base}^x$,
 * usata per disegnare la curva esatta (non un'interpolazione tra i punti). */
export interface GraphPointDragExercise extends GraphPointBase {
  type: "graph-point";
  mode: "drag";
  coeff: number;
  base: number;
  known: DayCount[];
  targetDay: number;
  correctValue: number;
  /** se vero, una volta risolto disegna la curva esatta della funzione */
  showCurveOnSolve?: boolean;
}

/** Schermata di riepilogo non interattiva: mostra tutti i punti già collocati
 * più la curva esatta della funzione, con formula e testo esplicativo.
 * `compare` è opzionale: se presente, sovrappone una SECONDA curva (con il suo
 * punto e cerchio) per confrontare due funzioni, es. due basi diverse. */
export interface GraphPointConceptExercise extends GraphPointBase {
  type: "graph-point";
  mode: "concept";
  coeff: number;
  base: number;
  points: DayCount[];
  formula: string;
  conceptText: string;
  /** punto della curva principale da evidenziare con un cerchio puntinato (opzionale) */
  circlePoint?: DayCount;
  compare?: {
    coeff: number;
    base: number;
    /** punto della curva di confronto da evidenziare con un cerchio puntinato */
    circlePoint: DayCount;
  };
}

/** Come GraphPointDragExercise, ma il valore si scrive con un tastierino
 * numerico invece di trascinare un punto: mentre si digita, un puntino live
 * appare/si sposta sul grafico all'altezza corrispondente, alla x fissata
 * da `targetDay` (usato nelle equazioni esponenziali più astratte, dove
 * l'obiettivo è calcolare mentalmente moltiplicando/dividendo per la base,
 * non "indovinare" trascinando). La curva esatta è sempre disegnata, anche
 * prima di rispondere: qui l'obiettivo non è "indovinare guardando il
 * grafico", ma applicare il calcolo (moltiplicare/dividere per la base). */
export interface GraphPointTypedExercise extends GraphPointBase {
  type: "graph-point";
  mode: "typed";
  coeff: number;
  base: number;
  known: DayCount[];
  targetDay: number;
  correctValue: number;
}

/** L'inverso di GraphPointTypedExercise: qui si dà il valore della funzione
 * (disegnato come una retta orizzontale tratteggiata che interseca la curva)
 * e si scrive la $x$ che lo produce — cioè si risolve l'equazione esponenziale
 * $\text{coeff} \cdot \text{base}^x = \text{targetValue}$ leggendo il punto
 * d'intersezione. La curva e la retta sono sempre disegnate. */
export interface GraphPointSolveExercise extends GraphPointBase {
  type: "graph-point";
  mode: "solve";
  coeff: number;
  base: number;
  targetValue: number;
  /** testo mostrato al posto del valore decimale di `targetValue` sulla retta
   * orizzontale (es. "1/4"): usato quando il valore è una frazione, per non
   * mostrarla come numero con la virgola. */
  targetValueLabel?: string;
  correctX: number;
}

export type GraphPointExercise =
  | GraphPointDragExercise
  | GraphPointTypedExercise
  | GraphPointSolveExercise
  | GraphPointConceptExercise;

/** Lo studente trascina tessere numeriche per completare la formula
 * $y = \text{coeff} \cdot \text{base}^n$ a partire dai punti già visti sul grafico.
 * - Se `correctCoeff` è presente, il coefficiente va trascinato (caso lezione 3).
 * - Se `fixedCoeff` è presente, il coefficiente è mostrato già scritto (non trascinabile).
 * - Se nessuno dei due è presente, la formula si riduce a $y = \text{base}^n$.
 * - Se `fixedBase` è presente, la base è mostrata già scritta (non trascinabile) e
 *   solo il coefficiente va trascinato (specularmente a `fixedCoeff`). */
export interface FormulaBuildExercise {
  type: "formula-build";
  id: string;
  prompt: string;
  points: DayCount[];
  maxDay: number;
  maxValue: number;
  yStep: number;
  tileValues: number[];
  correctCoeff?: number;
  fixedCoeff?: number;
  correctBase: number;
  fixedBase?: number;
  explanation?: string;
  /** etichetta dell'asse orizzontale, es. "Giorni" o "Ore" (default "Giorni") */
  axisLabel?: string;
  /** etichetta dell'asse verticale, es. "Batteri" o "Cellule" (default "Batteri") */
  quantityLabel?: string;
  /** etichetta singolare per il cerchio del valore iniziale, es. "Giorno" o "Ora" (default "Giorno") */
  dayLabel?: string;
  /** se vero, mostra accanto al grafico il cerchio puntinato con il valore al giorno 0 */
  showInitialValueCircle?: boolean;
  /** notazione usata a sinistra dell'uguale: "y" (default) oppure "f(x)", per le
   * lezioni più astratte che introducono la notazione funzionale. */
  notation?: "y" | "f(x)";
  /** se vero, la base si scrive come frazione $\frac{1}{\square}$: `correctBase`
   * rappresenta il denominatore da trascinare (non la base vera e propria, che
   * matematicamente è $1 / \text{correctBase}$). Usato per le basi frazionarie
   * di decrescita esponenziale (es. $\frac{1}{5}$). */
  fractionalBaseDenominator?: boolean;
  /** se vero, l'esponente si scrive come "-n" invece di "n": `correctBase` è
   * un intero normale (non un denominatore), ma matematicamente equivale a
   * $\text{base}^{-n} = \left(\frac{1}{\text{base}}\right)^n$. Alternativa
   * alla frazione per rappresentare la stessa decrescita esponenziale.
   * Mutuamente esclusivo con `fractionalBaseDenominator`. */
  negativeExponent?: boolean;
  /** Se presente, la base si sceglie trascinando un'intera tessera-frazione
   * (es. "2/3"), invece di costruirla da numeratore/denominatore separati:
   * usato per basi decimali/frazionarie proprie qualsiasi, non solo reciproci
   * 1/n. `correctBase` deve essere il valore decimale della frazione corretta
   * (es. 2/3), che deve comparire anche tra queste tessere. Mutuamente
   * esclusivo con `fractionalBaseDenominator` e `negativeExponent`. */
  fractionBaseTiles?: FractionValue[];
}

/** Una frazione propria mostrata come tessera atomica (numeratore e
 * denominatore insieme), usata da `fractionBaseTiles`. */
export interface FractionValue {
  numerator: number;
  denominator: number;
}

/** Lo studente trascina una tessera nella casella dell'esponente per risolvere
 * un'equazione del tipo $\text{fixedCoeff} \cdot \text{base}^{\square} = \text{targetResult}$
 * (o senza coefficiente se `fixedCoeff` è assente). */
export interface ExponentEquationExercise {
  type: "exponent-equation";
  id: string;
  prompt: string;
  fixedCoeff?: number;
  base: number;
  /** testo mostrato al posto del valore numerico di `base` (es. "e"): utile
   * quando la base è un numero irrazionale come $e$. */
  baseLabel?: string;
  /** se presente, la base si mostra come frazione impilata (numeratore sopra,
   * denominatore sotto una lineetta) invece che come decimale o testo inline. */
  baseFraction?: FractionValue;
  targetResult: number;
  /** se presente, il risultato si mostra come frazione impilata invece che
   * come numero decimale con la virgola. */
  resultFraction?: FractionValue;
  correctExponent: number;
  tileValues: number[];
  explanation?: string;
  /** se vero, il risultato non viene mostrato (appare "?"): usato quando serve
   * solo riconoscere quale esponente usare, non calcolare il valore esatto
   * (es. valori non interi in una decrescita esponenziale). */
  hideResult?: boolean;
}

/** Come ExponentEquationExercise, ma l'esponente si scrive con un tastierino
 * numerico invece di trascinare una tessera (livelli di verifica più avanzati). */
export interface TypedEvaluateExercise {
  type: "evaluate-expression";
  id: string;
  prompt: string;
  coeff: number;
  base: number;
  exponent: number;
  /** valore reale di coeff · base^exponent */
  result: number;
  /** quale dei due valori va digitato: il risultato oppure l'esponente */
  unknown: "result" | "exponent";
  explanation?: string;
}

/** Come FormulaBuildExercise, ma coefficiente e base si scrivono con un
 * tastierino numerico invece di trascinare le tessere.
 * - `correctCoeff` presente: il coefficiente va scritto (casella dedicata).
 * - `fixedCoeff` presente: il coefficiente è già scritto, non modificabile.
 * - nessuno dei due: la formula si riduce a $y = \text{base}^n$.
 * - `fixedBase` presente: la base è già scritta, non modificabile (specularmente
 *   a `fixedCoeff`); in questo caso va scritto solo il coefficiente. */
export interface TypedFormulaExercise {
  type: "typed-formula";
  id: string;
  prompt: string;
  points: DayCount[];
  maxDay: number;
  maxValue: number;
  yStep: number;
  /** passo delle etichette sull'asse orizzontale (default 1): da aumentare
   * quando `maxDay` è grande, per evitare etichette sovrapposte. */
  xStep?: number;
  correctCoeff?: number;
  fixedCoeff?: number;
  correctBase: number;
  fixedBase?: number;
  /** testo mostrato al posto del valore numerico di `fixedBase` (es. "e",
   * "e^2", "1/e"): utile quando la base fissa è un numero irrazionale come
   * $e$, che non avrebbe senso mostrare con tutti i suoi decimali. */
  fixedBaseLabel?: string;
  /** come `fixedBaseLabel`, ma in sintassi LaTeX: usato solo nel riepilogo
   * "Formula corretta" finale (renderizzato con KaTeX), es. "e" o "\\dfrac{1}{e}". */
  fixedBaseLatex?: string;
  axisLabel?: string;
  quantityLabel?: string;
  explanation?: string;
  /** notazione usata a sinistra dell'uguale: "y" (default) oppure "f(x)". */
  notation?: "y" | "f(x)";
  /** se vero, la base si digita come frazione (numeratore e denominatore
   * scritti separatamente col tastierino) invece che come intero: usato per
   * basi decimali proprie nelle verifiche di livello più avanzate.
   * `correctBase` deve comunque essere il valore decimale (per disegnare la
   * curva), mentre questi due campi indicano numeratore/denominatore ESATTI
   * richiesti, nella forma ridotta. */
  fractionalBase?: boolean;
  correctBaseNumerator?: number;
  correctBaseDenominator?: number;
  /** se vero, non disegna alcun grafico: usato per esercizi puramente
   * algebrici ("scrivi un'espressione") dove il grafico non serve. */
  hideGraph?: boolean;
  /** se vero, nasconde la scritta "y =" / "f(x) =" a sinistra (l'esercizio
   * chiede solo l'espressione, non l'equazione completa). */
  hidePrefix?: boolean;
  /** se vero, nasconde l'esponente in alto a destra della base (usato per
   * il primo periodo, dove l'esponente vale 1 ed è sottinteso). */
  hideExponent?: boolean;
  /** se vero, il tastierino mostra anche il punto decimale per digitare la
   * base come numero decimale (es. un fattore di crescita $1{,}05$). */
  allowDecimalBase?: boolean;
}

/** Grafico con i punti etichettati con le loro coordinate: lo studente legge
 * la base della funzione esponenziale e la sceglie tra alcune opzioni. */
export interface GraphBaseChoiceExercise {
  type: "graph-base-choice";
  id: string;
  prompt: string;
  coeff: number;
  base: number;
  points: DayCount[];
  maxDay: number;
  maxValue: number;
  yStep: number;
  choices: number[];
  /** etichetta dell'asse orizzontale (default "x") */
  axisLabel?: string;
  /** etichetta dell'asse verticale (default "y") */
  quantityLabel?: string;
  explanation?: string;
}

/** Come FormulaBuildExercise, ma senza grafico: i due punti noti sono dati
 * come testo ($f(0) = ...$, $f(1) = ...$) invece che letti da un grafico.
 * Usato per esercizi più astratti/algebrici (coefficiente e base possono
 * anche essere frazionari, es. base $0.5$ per una decrescita esponenziale). */
export interface TwoPointsFormulaExercise {
  type: "two-points-formula";
  id: string;
  prompt: string;
  valueAtZero: number;
  valueAtOne: number;
  tileValues: number[];
  correctCoeff: number;
  correctBase: number;
  explanation?: string;
}

/** Lo studente trascina tessere numeriche per completare la formula lineare
 * $y = \text{slope} \cdot n + \text{intercept}$ a partire da tre punti noti sul grafico. */
export interface LinearBuildExercise {
  type: "linear-build";
  id: string;
  prompt: string;
  points: DayCount[];
  maxDay: number;
  maxValue: number;
  yStep: number;
  tileValues: number[];
  correctSlope: number;
  correctIntercept: number;
  explanation?: string;
  /** etichetta dell'asse orizzontale, es. "Settimane" (default "Giorni") */
  axisLabel?: string;
  /** etichetta dell'asse verticale, es. "Follower" (default "Batteri") */
  quantityLabel?: string;
  /** etichetta singolare per il cerchio del valore iniziale, es. "Settimana" (default "Giorno") */
  dayLabel?: string;
  /** se vero, mostra accanto al grafico il cerchio puntinato con il valore al giorno 0 */
  showInitialValueCircle?: boolean;
}

/** Lo studente trascina tessere numeriche per completare la formula quadratica
 * $y = \text{coeff} \cdot n^2 + \text{intercept}$ a partire da tre punti noti sul grafico. */
export interface QuadraticBuildExercise {
  type: "quadratic-build";
  id: string;
  prompt: string;
  points: DayCount[];
  maxDay: number;
  maxValue: number;
  yStep: number;
  tileValues: number[];
  correctCoeff: number;
  correctIntercept: number;
  explanation?: string;
  /** etichetta dell'asse orizzontale, es. "Settimane" (default "Giorni") */
  axisLabel?: string;
  /** etichetta dell'asse verticale, es. "Follower" (default "Batteri") */
  quantityLabel?: string;
  /** etichetta singolare per il cerchio del valore iniziale, es. "Settimana" (default "Giorno") */
  dayLabel?: string;
  /** se vero, mostra accanto al grafico il cerchio puntinato con il valore al giorno 0 */
  showInitialValueCircle?: boolean;
}

/** Una serie di crescita usata negli esercizi di confronto (lineare, esponenziale o
 * quadratica): discriminata da `kind`, con i soli parametri necessari a quel tipo di funzione. */
export type GrowthSeries =
  | { kind: "linear"; intercept: number; slope: number; color: string; label: string }
  | { kind: "exponential"; coeff: number; base: number; color: string; label: string }
  | {
      kind: "quadratic";
      coeff: number;
      /** coefficiente del termine lineare (default 0): $y = \text{coeff}\cdot x^2 + \text{linear}\cdot x + \text{intercept}$. */
      linear?: number;
      intercept: number;
      color: string;
      label: string;
    };

interface CompareGrowthBase {
  id: string;
  prompt: string;
  maxDay: number;
  maxValue: number;
  yStep: number;
  /** passo delle etichette sull'asse orizzontale (default 1): da aumentare
   * quando `maxDay` è grande, per evitare etichette sovrapposte. */
  xStep?: number;
  seriesA: GrowthSeries;
  seriesB: GrowthSeries;
  /** etichetta dell'asse orizzontale, es. "Settimane" (default "Giorni") */
  axisLabel?: string;
  /** etichetta dell'asse verticale, es. "Follower" (default "Batteri") */
  quantityLabel?: string;
  explanation?: string;
}

/** Lo studente trascina orizzontalmente un indicatore lungo l'asse x per scegliere
 * il giorno/settimana in cui verificare una condizione (es. "la prima settimana in
 * cui la crescita esponenziale supera quella lineare"). Una volta toccato,
 * rivela il valore di entrambe le serie in quel punto tramite due cerchi colorati. */
export interface CompareGrowthDragExercise extends CompareGrowthBase {
  type: "compare-growth";
  mode: "drag";
  correctDay: number;
}

/** Schermata di riepilogo non interattiva: mostra entrambe le curve per intero
 * più i valori delle due serie in un giorno scelto, per fissare il concetto
 * (es. "l'esponenziale supera sempre il lineare, prima o poi"). */
export interface CompareGrowthConceptExercise extends CompareGrowthBase {
  type: "compare-growth";
  mode: "concept";
  circleDay: number;
}

export type CompareGrowthExercise =
  | CompareGrowthDragExercise
  | CompareGrowthConceptExercise;

/** Come CompareGrowthDragExercise, ma la risposta si scrive col tastierino
 * numerico invece di trascinare un indicatore (usato nelle verifiche di livello).
 * Se `requiresOperator` è vero, lo studente sceglie anche un operatore di
 * disuguaglianza (es. "x < 5" per "per quali x la funzione A supera la B?");
 * altrimenti si digita solo un numero (es. "qual è la prima settimana in cui..."). */
export interface GrowthCompareTypedExercise {
  type: "growth-compare-typed";
  id: string;
  prompt: string;
  maxDay: number;
  maxValue: number;
  yStep: number;
  xStep?: number;
  seriesA: GrowthSeries;
  seriesB: GrowthSeries;
  axisLabel?: string;
  quantityLabel?: string;
  requiresOperator?: boolean;
  correctOperator?: "<" | ">" | "=";
  correctValue: number;
  /** se presente, il valore si trascina da un vassoio di tessere invece di
   * scriverlo col tastierino (coerente con lo stile drag-and-drop delle
   * lezioni; il tastierino resta riservato alle verifiche di livello). */
  tileValues?: number[];
  /** righe (LaTeX, tramite MathText) mostrate sopra la selezione della
   * risposta: passaggi intermedi, es. per un raccoglimento. */
  steps?: string[];
  explanation?: string;
}

/** Schermata di riepilogo puramente testuale (nessun grafico): un breve
 * svolgimento a passi con formule in LaTeX, seguito da "Continua". Usata per
 * spiegazioni astratte che non hanno bisogno di un grafico di supporto. */
export interface TextConceptExercise {
  type: "text-concept";
  id: string;
  /** righe del testo esplicativo, in ordine (ognuna può contenere LaTeX tra $...$) */
  lines: string[];
  explanation?: string;
}

/** Lo studente digita un singolo numero (anche decimale) col tastierino per
 * completare un calcolo di crescita percentuale, es. "1000 + [___]" oppure
 * "1 + [___]" per il fattore di crescita. `prefixText`/`suffixText` sono
 * testo semplice (non LaTeX) mostrato prima/dopo la casella. */
export interface PercentGrowthExercise {
  type: "percent-growth";
  id: string;
  prompt: string;
  prefixText?: string;
  suffixText?: string;
  allowDecimal?: boolean;
  /** se vero, aggiunge un tasto "−" per digitare risposte negative (va
   * premuto come primo carattere). */
  allowNegative?: boolean;
  /** righe (LaTeX, tramite MathText) mostrate dentro il riquadro sopra la
   * casella di risposta: passaggi intermedi, es. per riportare due basi
   * diverse alla stessa base prima di uguagliare gli esponenti. */
  steps?: string[];
  /** se presente, la risposta si trascina da un vassoio di tessere numeriche
   * invece di scriverla col tastierino (coerente con lo stile "drag and
   * drop" usato altrove); il tastierino resta riservato alle verifiche di
   * livello. */
  tileValues?: number[];
  correctValue: number;
  explanation?: string;
}

export type Exercise =
  | RuleMatchingExercise
  | AlgebraTilesExercise
  | MultipleChoiceExercise
  | ExponentialDaysExercise
  | GraphPointExercise
  | FormulaBuildExercise
  | ExponentEquationExercise
  | GraphBaseChoiceExercise
  | TypedEvaluateExercise
  | TypedFormulaExercise
  | TwoPointsFormulaExercise
  | LinearBuildExercise
  | QuadraticBuildExercise
  | CompareGrowthExercise
  | GrowthCompareTypedExercise
  | TextConceptExercise
  | PercentGrowthExercise;

export interface Lesson {
  id: string;
  title: string;
  /** se assente/false, la lezione è giocabile; "coming-soon" mostra un nodo bloccato */
  status: "playable" | "coming-soon";
  exercises: Exercise[];
  xpReward: number;
  /** se vero, la lezione è una "verifica di livello": nessun feedback immediato
   * esercizio per esercizio, solo il punteggio finale. La lezione risulta
   * completata (XP assegnati) solo se la percentuale di risposte corrette
   * raggiunge la sufficienza; altrimenti si può solo riprovare da capo. */
  isLevelCheck?: boolean;
}

export interface Level {
  id: string;
  title: string;
  /** breve descrizione mostrata nella scheda di dettaglio del livello, es.
   * "Segui la diffusione di una barzelletta per vedere la crescita esponenziale." */
  description?: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  /** nome icona lucide-react, es. "Sigma" */
  icon: string;
  gradeLabel: string;
  status: "available" | "coming-soon";
  levels: Level[];
}
