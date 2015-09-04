# angular-multi-language
This module translates existing models and values.
It is not necessary to make changes to your code in order to run this module.
## Installation
#### Get module
Install with bower
```
bower install angular-multi-language
```
Install with github
```
git clone https://github.com/cherryApp/angular-multi-language.git
```
#### Add script to your webpage
```
<script src="[your packages path]/angular-multi-language/angular-multi-language.js"></script>
eg: 
<script src="../vendor/angular-multi-language/angular-multi-language.js"></script>
```
#### Create language files
eg: /lang/app-translate-en.json
#### Add module to the angular depedencies
```
var app = angular.module( "myModule", ["ng-ml"] );
```

## Settings
Found in angular-multi-language.js
```
ngMl.constant( "NgMlConfig", {

    // Initiale settings.
    "initSettings": {
        "dir": "lang/",
        "prefix": "app-translate-",
        "suffix": ".json",
        "fallback": "en"
    },
    "reg": {
        "_var": /\#([0-9a-zA-Z]*)\#/g,
        "_clean": /\#[0-9a-zA-Z]*\#/g,
        "_key": /[^a-zA-Z0-9_\$]/g,
        "_br": /[\{\}]/g,
        "_space": / +/g
    }

} );
```
* **initial settings:**
* **dir:** directory of language files
* **prefix**: prefix of language file names
* **suffix**: suffix of language file names
* **fallback**: language code of default language, eg: en
* **regular expressions (if you know what are you doing):**
* **_var**: find variables in string
* **_clean**: change variables in string
* **_key**: change regular stings to object key
* **_br**: clear brackets from the angular expressions
* **_space**: change all spaces to '_' character

## Language files
Language files are simple json files.
**The name of language file must contains languge code**
eg: app-translate-en.json or app-translate-de.json
This module automatically detects browser language and gets corresponding file.
```
{
	"username_email": "Username/email",
	"email": "Email",
	"password": "Password",
	"register": "register",
	"sign_in": "sign in",
	"forgot_password": "Forgot your password?",
	"password_change_successfully_message": "<strong>Your password successfully changed.</strong><br>You can enter with your new password.",

	"menu_home": "Home",
	"menu_library": "Library",
	"menu_quote": "Quote",
	"menu_settings": "Settings",
	"menu_window": "Window",
	"menu_help": "Help",

	"save_setting": "Save settings"
}
```

## Examples
### Simple expressions
Change expressions automatically, if language file contains it.
Language file: 
```
"menu_window": "Ventana"
```
Expression:
```
<li>{{ menu_window }}</li>
```
Output:
```
<li>Ventana</li>
```
### Variables
in the language file: 
```
"hello_$": "Hola $1"
```
in the template:
```
<h2>{{ hello_$ }}</h2>
```
in the controller:
```
$scope.message = "Hello #Jason#!";
```
your output:
```
<h2>Hola Jason!</h2>
```

## Thanks for using the module.
If your need help, please feel free to write an issue.







