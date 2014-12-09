import names
import random

fout=open("testdata.csv","w")
fout.write("name,selected,hoofddokter,cholesterol,diploma,religie,inkomen,#sigaretten,alcohol,systolische bloeddruk,diastolische bloeddruk,gewicht,glycemie,leeftijd,lat,lng,geslacht,icpc,count,#dagen sinds bezoek\n")
for num in range(1,100):
	gender = random.choice(['male', 'female'])
	headPhysician = random.choice(["Evan Ogilvie", "Bennett Hannaman", "Gerald Charity", "Caterina Quiroz", "Milly Slusser", "Cathern Dagenhart", "Ninfa Mandeville", "Wilma Popham", "Jeanne Valletta", "Deb Schroder"])
	degree = random.choice(["lager secundair", "secundair", "hoger onderwijs (kort)", "hoger onderwijs (lang)", "universitair"])
	patient_name = names.get_full_name(gender=gender)
	cholesterol = random.randint(90,210)
	religion = random.choice(["Katholiek", "Orhodox", "Anglicaans", "Prostestants", "Joods", "Moslim", "Vrijzinnig"])
	income = random.uniform(800,5000)
	smoker = random.choice(["roker", "niet-roker"])
	if smoker == "roker":
		sigarets = random.randint(1, 20)
	else:
		sigarets = 0
	alcohol = random.randint(0,5)
	blood_pressure_high = random.randint(70,190)
	blood_pressure_low = random.randint(40,100)
	weight = random.randint(20,150)
	sugar = random.randint(50,160)
	age = random.randint(1,110)
	days_since_last_visit = random.randint(1,100)
	lat = random.uniform(50.687431, 51.049931)
	lng = random.uniform(3.889410, 5.188080)
	icpc = random.choice(["Aids en hiv-infectie", "Kanker", "Gezichtsstoornissen", "Gehoorstoornissen", "Aangeboren afwijkingen van het hartvaatstelsel", "Aandoeningen van het endocard/hartklepafwijkingen", "Hartfalen", "Coronaire hartziekten", "Hartritmestoornissen", "Beroerte", "Reumatoide artritis", "Perifere artrose", "Chronische nek- en rugklachten", "Osteoporose", "Ziekte van Parkinson", "Epilepsie", "Migraine", "Aandoeningen gerelateerd aan alcohol", "Dementie (inclusief alzheimer)", "Schizofrenie", "Stemmingsstoornissen", "Angststoornissen", "Overspanning/burn-out", "Persoonlijkheidsstoornissen", "Verstandelijke handicap", "COPD", "Astma", "Diabetes mellitus"])
	printline = patient_name + ",false," + str(headPhysician) + "," + str(cholesterol) + "," + str(degree) + "," + str(religion) + "," + str(income) + "," + str(sigarets) + "," + str(alcohol) + ","+ str(blood_pressure_high) + "," + str(blood_pressure_low) + "," + str(weight) + "," +str(sugar) + "," + str(age) + "," + str(lat) + "," + str(lng) + "," +  gender + "," + icpc +",1," + str(days_since_last_visit) + '\n'
	fout.write(printline)
fout.close()