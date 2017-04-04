# An Invoice Generator App in AngularJS

This an angularJs app for invoice generation and mailing the generated invoice in pdf format.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

Inorder to get this app working, you need to have a REST API backend up and running. 
Run the following commands to install and run the backend Django project.

```
git clone https://ajithspark@bitbucket.org/ajithspark/invoice-generator-api.git

cd invoice-generator-api

pip install -r requirements.txt

python manage.py runserver

```

### Installing

Clone this repository to your local machine using these commands,

```
git clone https://ajithspark@bitbucket.org/ajithspark/invoice-generator.git
```

Open the project and set the API base url in the app/app.js file,

change this line,
```
.constant('url', 'http://192.168.1.105:8000')
```
To,

```
.constant('url', 'your url')
```
If you are running the backend project on your local machine, it will be

```
.constant('url', 'http://localhost:8000')
``` 


## Running the App

Open the index.html in a browser and start using the app.

