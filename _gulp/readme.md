# Сборщик gulp под ubuntu

1. устанавливаем **node**
1. в папке с проектом запускаем **npm install**
1. после установки пакетов **npm run html** - произойдет компиляция всех файлов pug
1. **npm run css** - произойдет компиляция всех файлов scss
1. **npm run watch** - запуск gulp watch - автоматическое отслеживание изменений файлов pug, scss
1. **npm run critical** - запуск gulp critical - создание критических стилей и добавление в шапку, подробнее [тут](https://web.dev/extract-critical-css/?ref=ewebdesign.com) 

> PS **npm run gulp** - запуск локального сервера, с автоматической компиляцией pug, scss и перезагрузкой браузера 

*Документация*

1. scss - https://sass-scss.ru/documentation/
1. pug - https://pugjs.org/api/getting-started.html
1. конвертер css to scss - http://css2sass.herokuapp.com/
1. конвертер html to pug - https://html2jade.org/