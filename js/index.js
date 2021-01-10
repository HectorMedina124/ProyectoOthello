var tablero="";
var jugador1=30;
var jugador2=30;
var turno=false;
var posicionesDisp=Array();
var cpu=null;
var cpu2=null
var tipoAlgoritmo=null;
var stopGame=false;
function mostarSelect(){
	var tipoJuego=$("#tipoJuego").val();
	if(tipoJuego!="Jugador vs Jugador"){
		$("#contAlgoritmo").css("display","flex");

	}
	else{
		$("#contAlgoritmo").css("display","none");
	}
}
function iniciarJuego(){
	stopGame=false;
	tablero="";
	jugador1=30;
	jugador2=30;
	turno=false;
	tipoAlgoritmo=null; //tipo de  algoritmo que se utilizara, en caso de que sea jugador vs jugador se quedara null
	cpu=null // variables que nos ayudan a determinar si es maquina vs jugador o maquina vs maquina
	cpu2=null // si cpu2 no es nullo entonces la partida es  maquina vs maquina
	$("#info-box").css("display","block");
	$("#info").css("display","block");
	$("#winner").css("display","none");
	$("#winnerTitle").css("display","none");
	$("#blancas").html("Fichas blancas en total: "+2);
	$("#negras").html("Fichas blancas en total: "+2);
	$("#ultFicha").html("Ultima ficha puesta en: ");
	$("#start").css("display","none");
	$("#stop").css("display","block");
	
	var tipoJuego=$("#tipoJuego").val();//obtiene el modo de juego
	$("#tipoJuego").attr("disabled","true");
	generarTableroGrafico();
	generarTableroLogico();
	//console.log(tablero);
	//se determina el tipo de juego que se usara en la partida
	switch(tipoJuego){
		case "Jugador vs Jugador":
		inicioTurno("1");

		break;

		case "Jugador vs Maquina":
			tipoAlgoritmo=$("#tipoAlgoritmo").val();
			$("#tipoAlgoritmo").attr("disabled","true");
			cpu="2"; //le hacemos saber a la cpu que jugador le toca
			inicioTurno("1");
			

		break;

		case "Maquina vs Maquina":
			tipoAlgoritmo=$("#tipoAlgoritmo").val();
			$("#tipoAlgoritmo").attr("disabled","true");
			cpu2="2";
			cpu="1";
			inicioTurno("1");

		break;

	}	
}


function detenerJuego(){
	$("#stop").css("display","none");
	$("#start").css("display","block");
	$("#info").css("display","none");
	$("#winnerTitle").css("display","none");
	$("#winner").css("display","block");
	$("#winner").html("El juego ah sido detenido");
	$("#tipoJuego").removeAttr("disabled");
	$("#tipoAlgoritmo").removeAttr("disabled");
	$("#tipoAlgoritmo").removeAttr("disabled"); //reinicia la parte grafica
	stopGame=true;
	$("#tablero").html("");
}



function inicioTurno(jugadorActual){
	console.log("inicio");
	if((!tableroLleno(tablero)) && !stopGame){
		if(jugadorActual=="1"){
			$("#turno").html("Turno del jugador 1 (fichas negras)");
		}
		else{
			$("#turno").html("Turno del jugador 2 (fichas blancas)");

		}
		var possible=getPossiblePostion(jugadorActual,this.tablero);
		console.log(possible);
		if(possible.length==0){
			var jugadorSig="2";
				if(jugadorActual=="2"){
					jugadorSig="1";
				}
				var possibleSig=getPossiblePostion(jugadorSig,this.tablero);
				console.log(possibleSig);
			if(possibleSig.length!=0){
				console.log("entro no hay jugadas");
				inicioTurno(jugadorSig);
				alert("No tienes posibles jugadas, paso de turno");
			}
			else{
				terminarJuego();
			}
			
		}
		else{
			juntarFichasRepetidas(possible);
			pintarEspaciosDisponibles(possible,jugadorActual);
			if(tipoAlgoritmo!=null && cpu==jugadorActual || cpu2==jugadorActual){
				if(cpu2!=null){
					$("#fondo").attr("class","fondo-active-MM");
				}
				else{
					$("#fondo").attr("class","fondo-active");
				}
				
				switch(tipoAlgoritmo){
					case "MinMax":
						setTimeout(function(){minMax(tablero,0,possible,jugadorActual);},1000); // 3000ms = 3s
					break;
					case "MinMax Podaalfa":
						setTimeout(function(){minMaxPodaAlfa(tablero,0,possible,jugadorActual,null,null);},1000); // 3000ms = 3s
					break;
					case "Algortimo genetico":
						setTimeout(function(){genetico(possible,tablero,jugadorActual);},1000); 
					break;
				}
				
				
			}	
		}
		
	}
	else{
		
		terminarJuego();
	}
	

}

function terminarJuego(){
	$("#info").css("display","none");
	$("#winnerTitle").css("display","block");
	$("#winner").css("display","block");
	if(cpu2!=null){
		$("#fondo").attr("class","fondo");
	}
	var negras=document.getElementsByClassName("black").length;
	var blancas=document.getElementsByClassName("white").length;
		if(negras>blancas){
			$("#winner").html("El jugador 1 con "+negras+" fichas negras en el tablero");
		}
		else if(blancas>negras){
			$("#winner").html("El jugador 2 con "+blancas+" fichas blancas en el tablero");
		}
		else if(blancas==negras){
			$("#winner").html("Empate");
		}
}

function generarTableroLogico(){
	//incializacion del tablero logico
	//0 para espacios vacios
	//2 para fichas blancas
	//1 para fichas negras
	tablero = [];
	for(var i=0; i<8; i++) {
	 tablero[i] = new Array(8);
	} 

	for(var i=0; i<8; i++) {
	 	for(var j=0;j<8;j++){
	 		tablero[i][j]="0";
	 	}
	} 

	tablero[3][3]="2";
	tablero[3][4]="1";
	tablero[4][3]="1";
	tablero[4][4]="2";

}

function generarTableroGrafico(){
	var tablero="";
	for(var i=0;i<9;i++){
		tablero+="<tr>"
		for(var j=0;j<9;j++){
			if(i==0){
				tablero+="<td class='header'>"+j+"</td>";
			}
			else if(i!=0 && j==0){
				tablero+="<td class='header'>"+i+"</td>";
			}
			else{
				tablero+="<td><div id='"+(j-1)+"-"+(i-1)+"'></div></td>";
			}
			
		}
	}
	document.getElementById("tablero").innerHTML=tablero;
	$("#3-3").addClass("white");
	$("#3-4").addClass("black");
	$("#4-3").addClass("black");
	$("#4-4").addClass("white");
	
	

	
	
}

function getPossiblePostion(jugador,t){
	var possiblePostions=Array();
    contrincante="1";
	if(jugador=="1"){
		contrincante="2";
	}

	for(var i=0;i<8;i++){
		for(var j=0;j<8;j++){
			if(tablero[i][j]==jugador){
				//console.log("Jugador",jugador);
				var pos=getPossiblePostion2(i,j,contrincante,t);
				if(pos.length>0){
					 possiblePostions.push({posJugador:i+"-"+j,posiciones:pos});
				}

			}

		}
	}
	return possiblePostions;
}

function getPossiblePostion2(i,j,contrincante,t){
	var posiciones=Array();
	//console.log("Coordenadas donde empieza a buscar",i,j);
	//console.log("contrincante",contrincante);
	var bandera=false;
	//busqueda hacia abajo
	 if(j!=7){
	 	var posicionesAVoltear=Array();
	 	for(var y=j+1;y<8;y++){
	 		if(t[i][y]==contrincante){
	 			posicionesAVoltear.push(i+"-"+y);
	 			bandera=true;
	 			
	 		}
	 		else if(t[i][y]=="0" && bandera==true){
	 			var posicion={i:i,j:y};
	 			posiciones.push({posicionFinal:posicion,fichasAVoltear:posicionesAVoltear});
	 			break;
	 		}
	 		else{
	 			break;
	 		}

	 	}
	 }

	 //busqueda hacia arriba
	 if(j!=0){
	 	bandera=false;
	 	var posicionesAVoltear=Array();
	 	for(var y=j-1;y>=0;y--){
	 		if(t[i][y]==contrincante){
	 			posicionesAVoltear.push(i+"-"+y);
	 			bandera=true;
	 			
	 		}
	 		else if(t[i][y]=="0" && bandera==true){
	 			var posicion={i:i,j:y};
	 			posiciones.push({posicionFinal:posicion,fichasAVoltear:posicionesAVoltear});
	 			break;
	 		}
	 		else{
	 			break;
	 		}

	 	}

	 }

	 //busqueda hacia la derecha
	 if(i!=7){
	 	bandera=false;
	 	var posicionesAVoltear=Array();
	 	for(var x=i+1;x<8;x++){
	 		if(t[x][j]==contrincante){
	 			posicionesAVoltear.push(x+"-"+j);
	 			bandera=true;
	 			
	 		}
	 		else if(t[x][j]=="0" && bandera==true){
	 			var posicion={i:x,j:j};
	 			posiciones.push({posicionFinal:posicion,fichasAVoltear:posicionesAVoltear});
	 			break;
	 		}
	 		else{
	 			break;
	 		}

	 	}

	 }


	 //busqueda hacia la izquierda
	 if(i!=0){
	 	bandera=false;
	 	var posicionesAVoltear=Array();
	 	for(var x=i-1;x>=0;x--){
	 		if(t[x][j]==contrincante){
	 			posicionesAVoltear.push(x+"-"+j);
	 			bandera=true;
	 			
	 		}
	 		else if(t[x][j]=="0" && bandera==true){
	 			var posicion={i:x,j:j};
	 			posiciones.push({posicionFinal:posicion,fichasAVoltear:posicionesAVoltear});
	 			break;
	 		}
	 		else{
	 			break;
	 		}

	 	}

	 }

	 //busqueda en diagonal baja derecha

	 if(i!=7 && j!=7){
	 	bandera=false;
	 	var posicionesAVoltear=Array();
	 	y=j;
	 	for(var x=i+1;x<8;x++){
	 		y++;
	 		if(t[x][y]==contrincante){
	 			posicionesAVoltear.push(x+"-"+y);
	 			bandera=true;
	 			
	 		}
	 		else if(t[x][y]=="0" && bandera==true){
	 			var posicion={i:x,j:y};
	 			posiciones.push({posicionFinal:posicion,fichasAVoltear:posicionesAVoltear});
	 			break;
	 		}
	 		else{
	 			break;
	 		}

	 	}

	 }

	 //busqueda en diagonal superior derecha

	 if(i!=0 && j!=0){
	 	bandera=false;
	 	var posicionesAVoltear=Array();
	 	y=j;
	 	for(var x=i-1;x>=0;x--){
	 		y--;
	 		if(t[x][y]==contrincante){
	 			posicionesAVoltear.push(x+"-"+y);
	 			bandera=true;
	 			
	 		}
	 		else if(t[x][y]=="0" && bandera==true){
	 			var posicion={i:x,j:y};
	 			posiciones.push({posicionFinal:posicion,fichasAVoltear:posicionesAVoltear});
	 			break;
	 		}
	 		else{
	 			break;
	 		}

	 	}

	 }


	 //diagonal invertida inferior

	  if(i!=0 && j!=7){
	 	bandera=false;
	 	var posicionesAVoltear=Array();
	 	y=j+1;	
	 	for(var x=i-1;x>=0 && y<8;x--){
	 		if(t[x][y]==contrincante){
	 			posicionesAVoltear.push(x+"-"+y);
	 			bandera=true;
	 			y++;
	 			
	 		}
	 		else if(t[x][y]=="0" && bandera==true){
	 			var posicion={i:x,j:y};
	 			posiciones.push({posicionFinal:posicion,fichasAVoltear:posicionesAVoltear});
	 			break;
	 		}
	 		else{
	 			break;
	 		}

	 	}

	 }


	  //diagonal invertida superior
	 if(i!=7 && j!=0){
	 	bandera=false;
	 	var posicionesAVoltear=Array();
	 	y=j-1;	
	 	for(var x=i+1;x<8 && y>=0;x++){
	 		if(t[x][y]==contrincante){
	 			posicionesAVoltear.push(x+"-"+y);
	 			bandera=true;
	 			y--;
	 			
	 		}
	 		else if(t[x][j]=="0" && bandera==true){
	 			var posicion={i:x,j:y};
	 			posiciones.push({posicionFinal:posicion,fichasAVoltear:posicionesAVoltear});
	 			break;
	 		}
	 		else{
	 			break;
	 		}

	 	}

	 }

	 return posiciones;
}

function juntarFichasRepetidas(possiblePostions){

	var posicionesComprobadas=Array("");
	for(var x=0;x<possiblePostions.length;x++){
		var posiciones=possiblePostions[x].posiciones;
		for(var y=0;y<posiciones.length;y++){
			var coodernadasABuscar=posiciones[y].posicionFinal.i+"-"+posiciones[y].posicionFinal.j; //cambiar el array
			if(posicionesComprobadas.indexOf(coodernadasABuscar)==-1){
				for(var z=x+1;z<possiblePostions.length;z++){
					var posicionesSig=possiblePostions[z].posiciones;
					for(var z2=0;z2<posicionesSig.length;z2++){
						var coodernadas=posicionesSig[z2].posicionFinal.i+"-"+posicionesSig[z2].posicionFinal.j;
						if(coodernadasABuscar==coodernadas){
							var pos1=posiciones[y].fichasAVoltear;
							var pos2=posicionesSig[z2].fichasAVoltear;
							posiciones[y].fichasAVoltear=posiciones[y].fichasAVoltear.concat(pos2);
							posicionesSig[z2].fichasAVoltear=posicionesSig[z2].fichasAVoltear.concat(pos1);
							

						}

					}
					posicionesComprobadas.push(coodernadasABuscar);
				}
				
			}
			

		}
		
	}
}

function pintarEspaciosDisponibles(possiblePostions,jugador){
	console.log(tablero);
	for(var x=0;x<possiblePostions.length;x++){
		var posiciones=possiblePostions[x].posiciones;
		for(var y=0;y<posiciones.length;y++){
			var i=posiciones[y].posicionFinal.i;
			var j=posiciones[y].posicionFinal.j;
			var id="#"+i+"-"+j;
			if($(id).hasClass("black") ||  $(id).hasClass("white")){

			}
			else{
				$(id).addClass("possible-space");
				posicionesDisp.push(id);
				$(id).attr("onclick","ponerFicha(this,'"+jugador+"','"+posiciones[y].fichasAVoltear+"')");
			}
			
		}
		
	}

}

function ponerFicha(div,jugador,fichasAVoltear){
	console.log("llega");
	var cls="black";
	jugadorSiguiente="2";
	if(jugador=="2"){
		jugador2--;
		cls="white"
		jugadorSiguiente="1";
	}
	else{
		jugador1--;
	}
	$(div).removeClass("possible-space");
	$(div).addClass(cls);
	var i=parseInt($(div).attr('id').split("-")[0]);
	var j=parseInt($(div).attr('id').split("-")[1]);
	tablero[i][j]=jugador;
	$("#ultFicha").html("Ultima ficha puesta en: "+(i+1)+"-"+(j+1));
	posicionesAVoltear=fichasAVoltear.split(",");
	voltearFichas(cls,posicionesAVoltear,jugadorSiguiente);

	
	

}
function voltearFichas(cls,posicionesAVoltear,jugadorSiguiente){
	clsRemove="white"
	jugador="1";
	if(cls=="white"){
		clsRemove="black"
		jugador="2";
	}

	for(var x=0; x<posicionesAVoltear.length;x++){
		$("#"+posicionesAVoltear[x]).removeClass(clsRemove);
		$("#"+posicionesAVoltear[x]).addClass(cls);
		var i=parseInt(posicionesAVoltear[x].split("-")[0]);
		var j=parseInt(posicionesAVoltear[x].split("-")[1]);
		tablero[i][j]=jugador;
	}
	//console.log("tablero actual",tablero);
	
		var blancas=document.getElementsByClassName("white").length;
		$("#blancas").html("Fichas blancas en total: "+blancas);
		var negras=document.getElementsByClassName("black").length;
		$("#negras").html("Fichas negras en total: "+negras);

	
	
	limpiarPosicionesDisponibles();

	inicioTurno(jugadorSiguiente); //inicia el siguiente turno al voltear las fichas


}

function limpiarPosicionesDisponibles(){
	for(var x=0;x<posicionesDisp.length;x++){
		$(posicionesDisp[x]).removeAttr("onclick");
		$(posicionesDisp[x]).removeClass("possible-space");
	}
	posicionesDisp=Array();
}

function countTablero(tablero){ //cuenta y retorna cuantas fichas hay actualemnte en el tablero logico(ya sea copia o original)
	var negras=0;
	var blancas=0;
	for(var x=0; x<8;x++){
		for(y=0;y<8;y++){
			if(tablero[x][y]=="1"){
				negras++;
			}
			else if(tablero[x][y]=="2"){
				blancas++;

			}

		}
	}
	var salida=""+negras+","+blancas;
	return salida
}




function tableroLleno(t){//determina si el tablero ya esta lleno o no
	for(var x=0; x<8;x++){
		for(y=0;y<8;y++){
			if(t[x][y]=="0"){
				return false;
			}
		}
	}
	return true;
}

function generarCopiaTablero(tableroC){ //genera una copia del tablero para las posibles jugadas en las iteraciones

	var copiaTablero = [];
	for(var i=0; i<8; i++) {
	 copiaTablero[i] = new Array(8);
	} 

	for(var i=0; i<8; i++) {
	 	for(var j=0;j<8;j++){
	 		copiaTablero[i][j]=tableroC[i][j];
	 	}
	} 

	return tableroC;


}

function funcionEvaluacion(blancas,negras){
	if(blancas>negras){
		return -100;
	}
	else if(blancas<negras){
		return 100;
	}
	else if(blancas==negras){
		return 0;
	}


}

function genetico(possiblePostions,tablero,jugador,conta){
	var m1=null;
	var m2=null;
	var utilidades=new Array();
	console.log("posibles",possiblePostions);
		for(var x=0;x<possiblePostions.length;x++){
			for(var y=0;y<possiblePostions[x].posiciones.length;y++){
				var copiaTablero=generarCopiaTablero(tablero);
				for(var z=0;z<possiblePostions[x].posiciones[y].fichasAVoltear.length;z++){
					var i=possiblePostions[x].posiciones[y].fichasAVoltear[z].split("-")[0];
					var j=possiblePostions[x].posiciones[y].fichasAVoltear[z].split("-")[1];
					copiaTablero[i][j]==jugador;
					var cuantos=countTablero(copiaTablero);
					var blancas=possiblePostions[x].posiciones[y].fichasAVoltear.length;
					utilidades.push({ejeX:possiblePostions[x].posiciones[y].posicionFinal.i,ejeY:possiblePostions[x].posiciones[y].posicionFinal.j,cantidad:blancas});
				}
			}
		}
		//cruza
		console.log(utilidades);
		var aux=1;
		utilidades.sort((a,b)=>b.cantidad-a.cantidad);
		console.log("sorteado",utilidades);
		if(utilidades.length>1){
			m1=utilidades[0].ejeX;
			m2=utilidades[1].ejeY;
		}
		else{
			m1=utilidades[0].ejeX;
			m2=utilidades[0].ejeY;
		}
		
		console.log("mora"+m1+"-"+m2,utilidades);
		var cant=utilidades[0].cantidad;
		var cruza=m1+"-"+m2;
		for (var i = 0; i < possiblePostions.length; i++) {
			for(var y=0; y < possiblePostions[i].posiciones.length;y++){
				var cruza2=possiblePostions[i].posiciones[y].posicionFinal.i+"-"+possiblePostions[i].posiciones[y].posicionFinal.j;
				console.log("posicion"+i,cruza2,cruza);
				if(cruza2==cruza){
					aux=0;
					m1=possiblePostions[i].posiciones[y].posicionFinal.i;
					m2=possiblePostions[i].posiciones[y].posicionFinal.j;
				}
			}
		}


		if (aux==1) {
			m1=utilidades[0].ejeX;
			m2=utilidades[0].ejeY;
		}
		
		//termina cruza
		//console.log("mora"+m1+"-"+m2,utilidades);
		if(m1 !=null && m2!=null){
			var i=0;
			var j=0;
			$("#"+m1+"-"+m2).click(); 
			if(cpu2==null){ //en caso de que cpu2 sea nullo se quita el fondo para que pueda el jugador humano jugar su turno, en caso de m vs m no se quita para que el jugador no interfiera en la partida
				$("#fondo").attr("class","fondo");
			}
		}
}


function minMax(tableroC,n,possiblePostions,jugador){
	//retorna -100 en caso de que el jugador 2 gane la partida ya que este es min
	//retorna 100 en caso de que el jugador 1 gane la partida ya que es max
	//retorna 0 en caso de que el juego sea empate
	//retorna la cantidad de fichas que hay en el tablero actualmente dependiendo de quien sea el jugador(en caso de las blancas lo multiplica *-1 por min)
	var cuantos=countTablero(tableroC);
	var blancas=parseInt(cuantos.split(",")[1]);
	var negras=parseInt(cuantos.split(",")[0]);
	var jugadorSiguiente="2";
	if(jugador=="2"){
		jugadorSiguiente="1";
	}

	if(n==4){	
		if(jugador=="1"){
			return negras;
		}
		else{
			return (blancas*-1);
		}
	}
	else if(tableroLleno(tableroC) ||possiblePostions.length==0){
			return funcionEvaluacion(blancas,negras);

	}

	var utilidades=new Array();
	for(var x=0;x<possiblePostions.length;x++){
		for(var y=0;y<possiblePostions[x].posiciones.length;y++){
			var copiaTablero=generarCopiaTablero(tableroC);
			for(var z=0;z<possiblePostions[x].posiciones[y].fichasAVoltear.length;z++){
				var i=possiblePostions[x].posiciones[y].fichasAVoltear[z].split("-")[0];
				var j=possiblePostions[x].posiciones[y].fichasAVoltear[z].split("-")[1];
				copiaTablero[i][j]==jugador;
			}
			var a=possiblePostions[x].posiciones[y].posicionFinal.i;
			var b=possiblePostions[x].posiciones[y].posicionFinal.j;
			copiaTablero[a][b]==jugador;
			var pS=getPossiblePostion(jugadorSiguiente,copiaTablero);
			var util=minMax(copiaTablero,n+1,pS,jugadorSiguiente); //itera en todas las posibles soluciones
			//utilidades.push({utilidad:util,fichasAVoltear:possiblePostions[x].posiciones[y].fichasAVoltear,posFinal:{i:1,j:1}});
			
			utilidades.push({utilidad:util,fichasAVoltear:possiblePostions[x].posiciones[y].fichasAVoltear,posFinal:possiblePostions[x].posiciones[y].posicionFinal});
		}

	}

	//Buscar mejor utilidad
	var indiceProsp=-1;
	for(var x2=0; x2<utilidades.length;x2++){
		if(x2!=0){
			if(jugador=="1"){
				if(utilidades[x2].util>utilidades[indiceProsp].util || ($("#"+i+"-"+j).hasClass("black") ||  $("#"+i+"-"+j).hasClass("white"))){
					var i=utilidades[x2].posFinal.i;
					var j=utilidades[x2].posFinal.j;
					console.log($("#"+i+"-"+j));
					if($("#"+i+"-"+j).hasClass("black") ||  $("#"+i+"-"+j).hasClass("white")){
						console.log("hasclass");
					}
					else{
						indiceProsp=x2;
						console.log("hasNotClass");
					}
					
				}
			}
			else{
				if(utilidades[x2].util<utilidades[indiceProsp].util || ($("#"+i+"-"+j).hasClass("black") ||  $("#"+i+"-"+j).hasClass("white"))){
					var i=utilidades[x2].posFinal.i;
					var j=utilidades[x2].posFinal.j;
					console.log($("#"+i+"-"+j));
					if($("#"+i+"-"+j).hasClass("black") ||  $("#"+i+"-"+j).hasClass("white")){
						console.log("hasclass");
					}
					else{
						indiceProsp=x2;
						console.log("hasNotClass");
					}	

				}
			}
		}
		else{
			indiceProsp=x2;
		}
	}
	
	if(n==0){
		console.log("entro");
		var i=utilidades[indiceProsp].posFinal.i;
		var j=utilidades[indiceProsp].posFinal.j;
		$("#"+i+"-"+j).click(); 
		console.log($("#"+i+"-"+j));
		if(cpu2==null){ //en caso de que cpu2 sea nullo se quita el fondo para que pueda el jugador humano jugar su turno, en caso de m vs m no se quita para que el jugador no interfiera en la partida
		$("#fondo").attr("class","fondo");
	}
		
	}
	else{
		console.log("Utilidades en la iteracion: "+n,utilidades);
		return utilidades[indiceProsp].utilidad;
	}
	
}


function minMaxPodaAlfa(tableroC,n,possiblePostions,jugador,alpha,beta){

	//retorna -100 en caso de que el jugador 2 gane la partida ya que este es min
	//retorna 100 en caso de que el jugador 1 gane la partida ya que es max
	//retorna 0 en caso de que el juego sea empate
	//retorna la cantidad de fichas que hay en el tablero actualmente dependiendo de quien sea el jugador(en caso de las blancas lo multiplica *-1 por min)
	var cuantos=countTablero(tableroC);
	var blancas=parseInt(cuantos.split(",")[1]);
	var negras=parseInt(cuantos.split(",")[0]);
	var jugadorSiguiente="2";
	if(jugador=="2"){
		jugadorSiguiente="1";
	}

	if(n==8){	
		if(jugador=="1"){

			return negras;
		}
		else{
			return (blancas*-1);
		}
	}
	else if(tableroLleno(tableroC) ||possiblePostions.length==0){
			return funcionEvaluacion(blancas,negras);

	}

	var utilidades=new Array();
	var util2=new Array();
	var alpha=alpha;
	var beta=beta;
	var v=null;
	for(var x=0;x<possiblePostions.length;x++){
		for(var y=0;y<possiblePostions[x].posiciones.length;y++){
			var copiaTablero=generarCopiaTablero(tableroC);
			for(var z=0;z<possiblePostions[x].posiciones[y].fichasAVoltear.length;z++){
				var i=possiblePostions[x].posiciones[y].fichasAVoltear[z].split("-")[0];
				var j=possiblePostions[x].posiciones[y].fichasAVoltear[z].split("-")[1];
				copiaTablero[i][j]==jugador;
			}
			var a=possiblePostions[x].posiciones[y].posicionFinal.i;
			var b=possiblePostions[x].posiciones[y].posicionFinal.j;
			copiaTablero[a][b]==jugador;
			var pS=getPossiblePostion(jugadorSiguiente,copiaTablero);
			var util=minMaxPodaAlfa(copiaTablero,n+1,pS,jugadorSiguiente,alpha,beta);
			if(v!=null){ //si v no es nulo verificamos lo siguiente
				if(jugador=="1"){ // si el jugador es 1 se busca maximizar entonces si la utlidad encontrada es mayor a la anterior se la pasamos a alpha y la menor la obtine beta
					if(util>v){
						beta=v;
						v=util;
						alpha=v;
					}
					else{
						beta=util;
					}
					if(beta!=null){ //en caso de que beta no sea nulo, comprobamos si alpha ya es mayor que beta si esto es cierto ya no necesitamos iterar otra vez y ahorramos caminos
						if(alpha>=beta){
							if(n==0 && !($("#"+a+"-"+b).hasClass("black") ||  $("#"+a+"-"+b).hasClass("white")) ){// si es la iteracion original se cambian las fichas
								utilidades.push({utilidad:util,fichasAVoltear:possiblePostions[x].posiciones[y].fichasAVoltear,posFinal:possiblePostions[x].posiciones[y].posicionFinal});
								console.log("util a mandar",$("#"+a+"-"+b));
								finMaxMinPodaAlpha(utilidades);
								return 0;
							}
							else{ //en caso de que no se retorna alpha como la utilidad
								console.log("retornando");
								console.log($("#"+a+"-"+b));
								if(($("#"+a+"-"+b).hasClass("black") ||  $("#"+a+"-"+b).hasClass("white"))){
									console.log("util a mandar",$("#"+a+"-"+b));
									console.log("hasnotClass");
								}
								else{
									return alpha;
								}
								
							}
						
						}
					}
					
				}
				else{
					if(util<v){ //de igual manera pero contrario, si se busca minimizar, preguntamos si v es mayor que la utilidad, si es el caso pasamos la utilidad a beta y la utilidad mayor a alpha
						alpha=v;
						v=util;
						beta=v;
					}
					else{
						alpha=util;
					}
					if(alpha!=null){ //en caso de que alpha no sea nulo se procede a retornar el valor en caso de que se cumpla la condicion
						if(alpha>=beta){
							if(n==0 && !($("#"+a+"-"+b).hasClass("black") ||  $("#"+a+"-"+b).hasClass("white")) ){
								utilidades.push({utilidad:util,fichasAVoltear:possiblePostions[x].posiciones[y].fichasAVoltear,posFinal:possiblePostions[x].posiciones[y].posicionFinal});
								finMaxMinPodaAlpha(utilidades);
								return 0;
							}
							else{
								console.log($("#"+a+"-"+b));
								if(($("#"+a+"-"+b).hasClass("black") ||  $("#"+a+"-"+b).hasClass("white"))){
									console.log("hasClass");
								}
								else{
									console.log("hasnotClass");
									return beta;
								}
								
							}
							
						}
					}
				}
			}
			else{ //si v es nulo entonces le damos la primera utilidad que encontramos, determinamos que queremos encontrar si alpha(maximizar) o beta(miminzar)
				v=util;
				if(jugador=="1"){
					alpha=v;
				}
				else{
					beta=v;
					
				}
			}
			util2.push({utilidad:util,fichasAVoltear:possiblePostions[x].posiciones[y].fichasAVoltear,posFinal:possiblePostions[x].posiciones[y].posicionFinal});
		}

	}

	if(n==0){
		console.log("utilidad default",util2);
		for(var o=0; o<util2.length; o++){
			var i=util2[o].posFinal.i;
			var j=util2[o].posFinal.j;
			if(!($("#"+a+"-"+b).hasClass("black") ||  $("#"+a+"-"+b).hasClass("white"))){
				finMaxMinPodaAlpha(util2);
				return 0;
			}
		}

			alert("Paso de turno");
			inicioTurno(jugadorSiguiente);


		
		return 0;
	}

	
	
}

function finMaxMinPodaAlpha(util){
	console.log(util);
	var i=util[0].posFinal.i;
	var j=util[0].posFinal.j;
	console.log($("#"+i+"-"+j));
	$("#"+i+"-"+j).click(); // 3000ms = 3s
	if(cpu2==null){
		$("#fondo").attr("class","fondo");
	}
	
}