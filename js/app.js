var app = angular.module('miApp', []);

app.controller("miControlador",['$scope','$timeout','$http',function($scope,$timeout, $http) {

	var array = new Object();
	var vocales = new Object();
	var tildes = new Object();
	var consonantes = new Object();

	var inicializarArrays = function(v,t,c) {
		vocales = v;
		tildes = t;
		consonantes = c;
	}

	$http.get('palabras.json').then(function(datos) {
		//console.log(typeof datos);
		//console.log(typeof datos.data);
		//console.log(typeof datos.data.palabras);
		//console.log(datos.data.palabras);
		array = datos.data.palabras;
		rangoPalabras = array.length-1;
		$scope.nPartidasRestantes = array.length;
		//console.log(typeof array);
		//console.log(elegirPalabraAleatoria(array));
		//var palabra = elegirPalabraAleatoria(array);
		inicializarArrays(datos.data.vocales,datos.data.tildes,datos.data.consonantes);
		nuevoJuego(array);
	});

	var palabraSecreta = "";
	var palabrasecretaFormateada = "";
	var rangoPalabras = 0;
	var indice = 0;
	var arrayAux = [];

	//aquí se crean dos arrays para ir almacenando las letras que se introducen. Se mete dentro del scope porque está dentro del propio scope del programa
	$scope.letrasIncorrectas=[];
	$scope.letrasCorrectas=[];

	//estos son los intentos que se pueden hacer
	$scope.intentos = 6;
	//esta es la palabra que se debe adivinar
	$scope.cadenaMostrada = "";

	$scope.nPartidasRestantes = 0;

	$scope.input = {
		letra:""
	}

	$scope.nAciertos = 0;
	$scope.nFallos = 0;

	var elegirPalabraAleatoria = function(array){
		var index = Math.round(Math.random()*rangoPalabras);
		//Voy a duplicar el contenido de un array en otro auxiliar
		arrayAux = JSON.parse(JSON.stringify(array));
		arrayAux[index] = array[rangoPalabras];
		arrayAux[rangoPalabras] = "";
		--rangoPalabras;
		--$scope.nPartidasRestantes;		
		return array[index];
	}

	var nuevoJuego = function(array) {
		console.log(array);
		palabraSecreta = elegirPalabraAleatoria(array);

		palabraSecretaFormateada = quitarTildes(palabraSecreta);

		console.log("palabraSecreta "+palabraSecreta);

		console.log("formateada: "+palabraSecretaFormateada);

		$scope.letrasIncorrectas = [];
		$scope.letrasCorrectas = [];
		$scope.intentos = 6;
		$scope.cadenaMostrada = "";

		var tempPalabraMostrada = "";
		
		for(var i = 0; i < palabraSecreta.length; i++) {
			tempPalabraMostrada +="*";
		}

		$scope.cadenaMostrada = tempPalabraMostrada;

	}

//A esta función hay que ponerla en el scope porque se llama desde la vista, no desde aquí dentro.
$scope.letraElegida = function() {

	if($scope.input.letra.length != 1) {
		$scope.input.letra = "";

		$scope.mensaje = "Debes introducir solo un caracter.";

		$timeout(function() {
			$scope.mensaje = "";
		},1000);

		return;
	}

	if(!caracterCorrecto()) {
		$scope.mensaje = $scope.input.letra+" no es un caracter admintido";

		$scope.input.letra = "";

		$timeout(function() {
			$scope.mensaje = "";
		},1000);

		return;

	}

		comprobarVocal();

		//Se empieza a recorrer el array donde están las letras que se han acertado y se compara con la letra que ha introducido el usuario en el input
		for (var i = 0; i < $scope.letrasCorrectas.length; i++) {
			if($scope.letrasCorrectas[i].toLowerCase() == $scope.input.letra.toLowerCase()) {
				$scope.input.letra = ""; //se vuelve a poner vacío esto
				return; //si entra en la condición, rompe la función y sale de ella
			}
		}

		//Lo mismo, pero con el array de las letras incorrectas
		for (var i = 0; i < $scope.letrasIncorrectas.length; i++) {
			if($scope.letrasIncorrectas[i].toLowerCase() == $scope.input.letra.toLowerCase()) {
				$scope.input.letra = "";
				return;
			}
		}

		//esto no es más que un flag que guarda si se acierta, o no.
		var correcto = false;

		//Si llegamos a quí, se recorre la palabra secreta y se comprueba si la letra está dentro de ella, o no.
		for(var i = 0; i < palabraSecreta.length; i++) {
			if($scope.input.letra.toLowerCase() == palabraSecretaFormateada[i].toLowerCase()) {
				$scope.cadenaMostrada = $scope.cadenaMostrada.substring(0,i)+palabraSecreta[i]+$scope.cadenaMostrada.substring(i+1);
				//En esta línea, lo que hago es seleccionar una subcadena de lo que está mostrando e ir hasta el índice de la letra que coincide con la que se muestra.
				//Después, se introduce la letra coincidente en vez de lo que había y se vuelve a meter una subcadena
				correcto = true;
			}
		}

		if(correcto) {
			$scope.letrasCorrectas.push($scope.input.letra.toLowerCase());
		} else {
			$scope.letrasIncorrectas.push($scope.input.letra.toLowerCase());
			--$scope.intentos;

		}


	$scope.input.letra = "";

	if($scope.intentos == 0) {
		++$scope.nFallos;
		alert("¡Has fallado! La palabra era: "+palabraSecreta.toUpperCase());
		
		$timeout(function(){
			nuevoJuego(arrayAux);
		},500);
	}

	if($scope.cadenaMostrada.indexOf("*") == -1) {
		++$scope.nAciertos;
		alert("¡Acertaste la palabra! "+palabraSecreta.toUpperCase());
		if(rangoPalabras >= 0) {
		$timeout(function(){
			nuevoJuego(arrayAux);
		},500);
		} else {
			alert("Ya no quedan palabras");
		}
	}
}

var comprobarVocal = function() {
	var l = $scope.input.letra.toLowerCase();
	if(esVocal(l)) {	
		for (var i = 0; i < vocales.length; i++) {
			if(l == vocales[i].toLowerCase() ||
				l.toLowerCase() == tildes[i].toLowerCase()) {
				$scope.input.letra = vocales[i].toLowerCase();
			return;
			}
		}
	}
}

var quitarTildes = function(palabra) {
	var salida = "";
	for (var i = 0; i < palabra.length; i++) {
		var encuentroTilde = false;
		if(esVocal(palabra[i])) {
			for (var j = 0; j < tildes.length; j++) {
				if(palabra[i].toLowerCase() == tildes[j].toLowerCase()) {
					salida += vocales[j];
					encuentroTilde = true;
					break;
				}
			}
		}
		if(!encuentroTilde)
			salida += palabra[i];
	}
	return salida;
}

var esVocal = function(letra) {
	for (var i = 0; i < vocales.length; i++) {
		if(letra.toLowerCase() == vocales[i].toLowerCase() ||
			letra.toLowerCase() == tildes[i].toLowerCase()) {
			return true;
		}
	}
	return false;
}

var esConsonante = function(letra) {
	for (var i = 0; i < consonantes.length; i++) {
		if(letra.toLowerCase() == consonantes[i].toLowerCase()) {
			return true;
		}
	}
	return false;
}

var caracterCorrecto = function() {
	if(esVocal($scope.input.letra) || esConsonante($scope.input.letra)) {
		return true;
	} else {
		return false;
	}
}


}])