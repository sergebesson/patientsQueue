# US

## TODO

* Ajout de l'API de gestion des `reasonRequest`
* Modification données de patientQueue :
  * patientQueue.phoneNumbers : n'est plus une list mais juste un numéro, renommé en phoneNumber
  * patientQueue.medicalInformation : Codification du motif de la demande (renommé en reasonRequest) et ajout d'un détail du motif de la demande
  * patientQueue.contacts : Ajout d'un type de contact (sms, email, phone, face-to-face)
* iu - filtre sur les différents state

## ON GOING

* Ajout d'un nouveau store `reasonRequest` avec juste key et label

## DONE

* Définir le json schema du store `patientsQueue`
* Création du store `patientsQueue`
* Création du module api `patientsQueue`
* iu - liste des patientQueue en cours

## Info

<https://projects.lukehaas.me/css-loaders/>
