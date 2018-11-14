var app = angular.module('miApp', []);

app.controller("miControlador",['$scope','$timeout',function($scope,$timeout) {

	//a continuación, se crea un array de palabras posibles entre las que se pueden mostrar en la pantalla
	var palabrasPosibles=["plastidecor","pelete","rosa","morado","pegote"];

	//aquí se crean dos arrays para ir almacenando las letras que se introducen. Se mete dentro del scope porque está dentro del propio scope del programa
	$scope.letrasIncorrectas=[];
	$scope.letrasCorrectas=[];

	//estos son los intentos que se pueden hacer
	$scope.intentos = 6;
	//esta es la palabra que se debe adivinar
	$scope.cadenaMostrada = "";

	$scope.input = {
		letra:""
	}

	//Esta es una función que se puede llamar en cualquier momento de la ejecución
	var elegirPalabraAleatoria = function(){
		var index = Math.round(Math.random()*(palabrasPosibles.length-1));
		return palabrasPosibles[index];
	}

	var nuevoJuego = function() {

		$scope.letrasIncorrectas = [];
		$scope.letrasCorrectas = [];
		$scope.intentos = 6;
		$scope.cadenaMostrada = "";

		palabraSecreta = elegirPalabraAleatoria();

		console.log(palabraSecreta);

		var tempPalabraMostrada = "";
		
		for(var i = 0; i < palabraSecreta.length; i++) {
			tempPalabraMostrada +="*";
		}
		//console.log(tempPalabraMostrada);

		$scope.cadenaMostrada = tempPalabraMostrada;

	}

//A esta función hay que ponerla en el scope porque se llama desde la vista, no desde aquí dentro.
	$scope.letraElegida = function() {

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
			if($scope.input.letra.toLowerCase() == palabraSecreta[i].toLowerCase()) {
				$scope.cadenaMostrada = $scope.cadenaMostrada.substring(0,i)+$scope.input.letra.toLowerCase()+$scope.cadenaMostrada.substring(i+1);
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
			alert("¡Has perdido!");
			$timeout(function(){
				nuevoJuego();
			},500);
		}

		if($scope.cadenaMostrada.indexOf("*") == -1) {
			alert("¡Acertaste la palabra! "+palabraSecreta.toUpperCase());
			$timeout(function(){
				nuevoJuego();
			},500);
		}


	}

	nuevoJuego();


}])