# -*- coding: latin-1 -*-
""" 
	Analizador Léxico v1.0.0
	Autor : Luis Ángel Méndez de León
	Fecha : Abril de 2017
"""
from __future__ import print_function
import sys

N = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
cero = '0'
			# 0   1   2   3   4   5   6   7   8   9  10  11  12  13   14   
			# *   C   -   (   )   N   0   P   I   H   V   &   S   L    b
estados = [ [ 1,  2,  3,  4,  5,  6, -1,  8,  8,  9,  9, 10, 11, 11, 110], #0
			[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 100], #1
			[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 101], #2
			[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 102], #3
			[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 103], #4
			[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 104], #5
			[-1, -1, -1, -1, -1,  7,  7, -1, -1, -1, -1, -1, -1, -1, 105], #6
			[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 105], #7
			[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 106], #8
			[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 107], #9
			[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 108], #10
			[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 109] ]#11

diccionarioEdos = {
				100 : 'Numero de copias',
				101 : 'Hoja a color',
				102 : 'Rango de impresion',
				103 : 'Apertura',
				104 : 'Cierre',
				105 : 'Numero de hoja',
				106 : 'Paridad',
				107 : 'Orientacion',
				108 : 'Imprimir primero',
				109 : 'Tamanno de hoja',
				110 : 'Blanco',
				 -2 : 'Caracter invalido',
				 -1 : 'Token invalido'
			}

def resultado(estado, token):
	print("[", token, "]-", diccionarioEdos.get(estado), "(", estado, ")", sep = "")

def analizadorV1(cadena):
	indice = 0
	estado = 0
	columna = 0
	token = ''
	while indice < len(cadena):
		if cadena[indice] == '*':
			columna = 0
		elif cadena[indice] == 'C':
			columna = 1
		elif cadena[indice] == '-':
			columna = 2
		elif cadena[indice] == '(':
			columna = 3
		elif cadena[indice] == ')':
			columna = 4
		elif cadena[indice] in N:
			columna = 5
		elif cadena[indice] == cero:
			columna = 6
		elif cadena[indice] == 'P':
			columna = 7
		elif cadena[indice] == 'I':
			columna = 8
		elif cadena[indice] == 'H':
			columna = 9
		elif cadena[indice] == 'V':
			columna = 10
		elif cadena[indice] == '&':
			columna = 11
		elif cadena[indice] == 'S':
			columna = 12
		elif cadena[indice] == 'L':
			columna = 13
		elif cadena[indice] == ' ':
			columna = 14
		else:															# caracter no valido
			estado = -2


		if estado != -2:
			estado = estados[estado][columna]

		if indice + 1 == len(cadena) and estado > 0 and estado < 100:  	# fin de cadena
			columna = 14
			estado = estados[estado][columna]

		if (cadena[indice] == ' ' and token == '') or cadena[indice] != ' ':  # extraer token, excluyendo delimitador
			token += cadena[indice]
		
		if estado >= 100 or estado < 0:									# >=100 token aceptado, <0 token invalido
			resultado(estado, token)
			token = ''
			if estado < 0:
				return
			estado = 0
		indice += 1


print("ANALIZADOR LEXICO v1.0.0".center(70, "="))
print("Autor: Luis Angel Mendez de Leon - Lenguajes y Automatas I")
print()

while True:
	analizadorV1(input("Ingrese cadena : "))
	input()
	while True:
		op = input("Continuar?  [s/n] ")
		if op == 'N' or op == 'n':
			sys.exit(0)
		elif op == 'S' or op == 's':
			break