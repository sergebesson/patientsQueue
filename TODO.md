# US

## TODO

* iu - Ajout de la creation, modification, suppression des motifs de la demande
* iu - filtre sur les différents state

## ON GOING

* iu - Ajout de la liste des motifs de la demande

## DONE

* Définir le json schema du store `patientsQueue`
* Création du store `patientsQueue`
* Création du module api `patientsQueue`
* iu - liste des patientQueue en cours
* Ajout d'un nouveau store `reasonRequest` avec juste id et label
* Ajout de l'API de gestion des `reasonRequest`
* Refactoring openapi de patientQueue
* Modification données de patientQueue :
  * patientQueue.patient.phoneNumbers : n'est plus une list mais juste un numéro, renommé en phoneNumber
  * patientQueue.patient.email : à ajouter
  * patientQueue.medicalInformation : Codification du motif de la demande (renommé en reasonRequest) et ajout d'un détail du motif de la demande
  * patientQueue.contacts : Ajout d'un type de contact (sms, email, phone, face-to-face, other)
* iu - Ajout de vue-router
* iu - Ajout de sass
* iu - Ajout d'un menu

## Info

<https://projects.lukehaas.me/css-loaders/>
