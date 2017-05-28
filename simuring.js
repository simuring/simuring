// Le disque
/////////////
var rayon = 300;
var xCentre = rayon;
var yCentre = rayon;
var xDecalage = rayon + 50;
var yDecalage = rayon + 50;

// Les cylindres
/////////////////
var cote = 8;
var nbCylindres = 100;
var lesCylindres = new Array(nbCylindres);
// les couleurs des états
var lesCouleurs = ['white', 'red', 'green'];

// créer un disque d'état et de position angulaire donnés
function unCylindre(angle, etat) {
    this.angle = angle;
    this.x = (int)((rayon - 2*cote)*cos(angle));
    this.y = (int)((rayon - 2*cote)*sin(angle));
    this.etat = etat;
    this.couleur = lesCouleurs[etat];
}

// dessiner le disque
unCylindre.prototype.dessiner = function() {
    //window.alert('coucou (' + this.x + '; ' + this.y + ')');
    push();
    translate(xDecalage, yDecalage);
    //translate((int)(cote/2), (int)(cote/2));
    stroke('black');
    strokeWeight((int)(cote/5));
    //window.alert('etat =' + this.etat);
    fill(lesCouleurs[this.etat]);
    ellipse(this.x, this.y, 2*cote, 2*cote);
    pop();
}

// calculer la distance entre le disque et la souris
unCylindre.prototype.distanceSouris = function() {
    xCentre = this.x + cote/2;
    yCentre = this.y + cote/2;
    xSouris = mouseX - xDecalage;
    ySouris = mouseY - yDecalage;
    //window.alert('le disque : (' + xCentre + '; ' + yCentre + ')');
    return (xCentre - xSouris)*(xCentre - xSouris) +
           (yCentre - ySouris)*(yCentre - ySouris);
}

// vérifie si le disque est sélectionné
unCylindre.prototype.estSelectionne = function() {
    //window.alert('disque : (' + this.x + '; ' + this.y + ')');
    lecartSouris = this.distanceSouris();
    //window.alert(lecartSouris);
    if (lecartSouris < 50) {
        //window.alert('redessine');
        this.etat = (this.etat + 1)%3;
        this.dessiner();
        return true;
    } else {
        return false;
    }
}

// change la position d'un disque
unCylindre.prototype.aGauche = function() {
    this.angle = this.angle + TWO_PI/nbCylindres;
    this.x = (int)((rayon - 2*cote)*cos(this.angle));
    this.y = (int)((rayon - 2*cote)*sin(this.angle));
    this.dessiner();
}

unCylindre.prototype.aDroite = function() {
    this.angle = this.angle - TWO_PI/nbCylindres;
    this.x = (int)((rayon - 2*cote)*cos(this.angle));
    this.y = (int)((rayon - 2*cote)*sin(this.angle));
    this.dessiner();
}

// change l'état d'un disque
unCylindre.prototype.changeEtat = function(letat) {
    this.etat = letat;
    this.dessiner();
}

// Les boutons de commande
///////////////////////////

var btn_Gauche = new unBouton(30, 700, "G", 'black');
var btn_Droite = new unBouton(90, 700, "D", 'yellow');
var btn_Blanc = new unBouton(180, 700, "B", 'white');
var btn_Zero = new unBouton(240, 700, "0", 'red');
var btn_Un = new unBouton(300, 700, "1", 'green');
var btn_Lecture = new unBouton(390, 700, "L", 'blue');
var btn_ValeurLue = new unBouton(450, 700, " ", 'white');
var btn_Avance = new unBouton(530, 700, ">", 'orange');
var btn_Demarre = new unBouton(590, 700, ")>", 'orange');
var btn_Stop = new unBouton(650, 700, "[]", 'orange');

// créer un bouton de texte modifiable et de position donnée
function unBouton(x, y,texte, couleur) {
    this.x = x;
    this.y = y;
    this.texte = texte;
    this.couleur = couleur;
}

// dessiner le bouton
unBouton.prototype.dessiner = function() {
    push();
    stroke('black');
    fill(this.couleur);
    rect(this.x, this.y, 40, 40);
    textSize(24);
    textAlign(LEFT);
    fill('purple');
    text(this.texte, this.x + 10, this.y + 30);
    pop();
}

// calculer la distance entre le bouton et la souris
unBouton.prototype.distanceSouris = function() {
    xCentre = this.x + 20;
    yCentre = this.y + 20;
    xSouris = mouseX;
    ySouris = mouseY;
    //window.alert('souris = (' + xSouris + '; ' + ySouris + ') pour centre = (' + xCentre + '; ' + yCentre + ')');
    return (xCentre - xSouris)*(xCentre - xSouris) +
           (yCentre - ySouris)*(yCentre - ySouris);
}

// vérifie si le bouton est sélectionné
unBouton.prototype.estSelectionne = function() {
    //window.alert("(" + mouseX + "; " + mouseY + ") pour " + this.distanceSouris());
    if (this.distanceSouris() < 800) {
        //window.alert('coucou');
        return true;
    } else {
        return false;
    }
}

// change le texte du bouton
unBouton.prototype.changeTexte = function(letexte) {
    this.texte = letexte;
    this.dessiner();
}

// La table des transitions
//////////////////////////

// la table des transtions
// contient les identifiants des éléments HTML qui ont été cochés
// c’est-à-dire les cases percées
var tableTransitions = [];

function idToGroup(id) {
    var splitted = id.split(/-|:/);
    var type = 'next state';
    if (splitted[2][0] == 'w') type = 'write';
    if (splitted[2][0] == 'l') type = 'move';
    if (splitted[2][0] == 'r') type = 'move';
    return splitted[0] + '-' + splitted[1] + ':' + type;
}

function percer(id) {
    tableTransitions.push(id);
    var laCase = document.getElementById(id);
    if (!laCase) {
        window.alert("Erreur de programmation: " + id);
    }
    laCase.style.background = "#ddd";
    laCase.innerHTML = "O";
}

function clickTable(uneCase) {
    var idx = tableTransitions.indexOf(uneCase.id);
    // si la case n’est pas trouée
    if (idx < 0) {
        var groupe = idToGroup(uneCase.id);
        // on décoche les éléments du même groupe
        for (var i = 0; i < tableTransitions.length; i++) {
            var idCase = tableTransitions[i];
            // i != idx pour ne pas tester la case courante
            if (i != idx && groupe == idToGroup(idCase)) {
                tableTransitions.splice(i);
                var eltCase = document.getElementById(idCase);
                eltCase.style.background = "white";
                eltCase.innerHTML = "&nbsp;";
            }
        }
        percer(uneCase.id);
    } else {
        tableTransitions.splice(idx, 1);
        uneCase.style.background = "white";
        uneCase.innerHTML = "&nbsp;";
    }
}

// L'animation
////////////////////////////

//var angle_base = TWO_PI / nbCylindres;

// La fonction de démarrage

function setup() {
    var leCanvas = createCanvas(800, 800);
    leCanvas.parent('monCanvas');

    // le disque dur
    push();
    translate(xDecalage, yDecalage);
    //translate(xCentre, yCentre);
    fill('#FFF168');
    noStroke();
    ellipse(0, 0,rayon*2, rayon*2);
    pop();

    // l'horloge
    push();
    translate(xDecalage, yDecalage);
    fill('gray');
    noStroke();
    ellipse(0, 0,rayon, rayon);
    fill('black');
    ellipse(0, 0,rayon/10, rayon/10);
    pop();

    // l'aiguille
    push();
    translate(xDecalage, yDecalage);
    strokeWeight(10);
    fill('black');
    line(0, 0,rayon/4, rayon/4);
    pop();

    // le repère de lecture
    push();
    translate(xDecalage, yDecalage);
    strokeWeight(8);
    fill('black');
    line(rayon + cote, 0,rayon + 3*cote, 0);
    pop();

    // les cylindres
    var angle_base = TWO_PI / nbCylindres;
    for (var i = 0; i < nbCylindres; i++) {
        lesCylindres[i] = new unCylindre(-angle_base*i, 0);
        lesCylindres[i].dessiner();
    }

    // les boutons
    textSize(24);
    textAlign(LEFT);
    fill('purple');
    // les boutons de déplacement
    text("Déplac.", 35, 680);
    btn_Droite.dessiner();
    btn_Gauche.dessiner();
    // les boutons d'écriture'
    text("Écriture", 220, 680);
    btn_Blanc.dessiner();
    btn_Zero.dessiner();
    btn_Un.dessiner();
    // le bouton de lecture
    text("Lecture", 395, 680);
    btn_Lecture.dessiner();
    btn_ValeurLue.dessiner();
    // les boutons de démarrage et autres
    btn_Avance.dessiner();
    btn_Demarre.dessiner();
    btn_Stop.dessiner();

    // chargement des données et du programme depuis l’URL
    var url = location.href;
    var questionMarkPos = url.indexOf('?');
    var queryString = url.substring(questionMarkPos + 1);
    if (questionMarkPos >= 0 && queryString !== "") {
        var segments = queryString.split('/');
        var binData = parseInt(segments[0]).toString(2).split('');
        var position = parseInt(segments[1]);
        binData.forEach(function(bit, idx) {
            var numCylindre = (idx - position + nbCylindres) % nbCylindres;
            var cylindre = lesCylindres[numCylindre];
            cylindre.etat = parseInt(bit) + 1;
            cylindre.dessiner();
        });
        segments.slice(2).forEach(function(segment) {
            if (segment != "") percer(segment);
        });
    }
}


// La fonction qui tourne en boucle
function draw() {}

// quand la souris est enfoncée
function mousePressed() {
    // test de la position de la souris
    //window.alert('souris (' + mouseX + '; ' + mouseY + ')');
    // window.alert('repère (' + (mouseX - xDecalage) + '; ' + (mouseY - yDecalage) + ')');

    // teste si un disque est dessous
    for (i = 0; i < nbCylindres; i++) {
        lesCylindres[i].estSelectionne();
    }

    // teste si le bouton gauche est sélectionné et décale vers la gauche
    if (btn_Gauche.estSelectionne()) {
        // remet le bouton de lecture à zéro
        btn_ValeurLue.changeTexte(" ");
        aGauche();
    }

    // teste si le bouton droite est sélectionné et décale vers la droite
    if (btn_Droite.estSelectionne()) {
        // remet le bouton de lecture à zéro
        btn_ValeurLue.changeTexte(" ");
        aDroite();
    }

    // teste quel bouton d'écriture est sélectionné et change l'état
    if (btn_Blanc.estSelectionne()) {
        // remet le bouton de lecture à zéro
        btn_ValeurLue.changeTexte(" ");

        // détecte le bouton sur la zone de lecture/écriture
        for (i = 0; i < nbCylindres; i++) {
            // je teste l'abscisse et non l'angle pour éviter le modulo 2π
            if (lesCylindres[i].x == 284) lesCylindres[i].changeEtat(0);
        }
    }

    if (btn_Zero.estSelectionne()) {
        // remet le bouton de lecture à zéro
        btn_ValeurLue.changeTexte(" ");
        // détecte le bouton sur la zone de lecture/écriture
        for (i = 0; i < nbCylindres; i++) {
            // je teste l'abscisse et non l'angle pour éviter le modulo 2π
            if (lesCylindres[i].x == 284) lesCylindres[i].changeEtat(1);
        }
    }

    if (btn_Un.estSelectionne()) {
        // remet le bouton de lecture à zéro
        btn_ValeurLue.changeTexte(" ");
        // détecte le bouton sur la zone de lecture/écriture
        for (i = 0; i < nbCylindres; i++) {
            // je teste l'abscisse et non l'angle pour éviter le modulo 2π
            if (lesCylindres[i].x == 284) lesCylindres[i].changeEtat(2);
        }
    }

    // lecture
    if (btn_Lecture.estSelectionne()) {
        lecture();
    }

    // Démarrage et autres
    if (btn_Avance.estSelectionne()) {
        avance();
    }
    if (btn_Demarre.estSelectionne()) {
        demarre();
    }
    if (btn_Stop.estSelectionne()) {
        stop();
    }
}

function aGauche() {
    for (i = 0; i < nbCylindres; i++) {
        lesCylindres[i].aGauche();
    }
}

function aDroite() {
    for (i = 0; i < nbCylindres; i++) {
        lesCylindres[i].aDroite();
    }
}

function lecture() {
    var lu = false;
    var i = 0;
    while (!lu && i < nbCylindres) {
        var symbole = " ";
        // je teste l'abscisse et non l'angle pour éviter le modulo 2π
        if (lesCylindres[i].x == 284) {
            if (lesCylindres[i].etat == 0) symbole = "B";
            if (lesCylindres[i].etat == 1) symbole = "0";
            if (lesCylindres[i].etat == 2) symbole = "1";
            btn_ValeurLue.changeTexte(symbole);
            lu = true;
        }
        i++;
    }
    return symbole;
}
