"use strict";

//-----------  Dropdown list in nav

var droppedItems = document.getElementsByClassName("menu__item_dropdown");
for (var i = 0; i < droppedItems.length; i++) {
    droppedItems[i].addEventListener("mouseover", function () {

        var nestedList = this.getElementsByTagName("ul")[0];
        nestedList.classList.add("menu-active");
    });
    droppedItems[i].addEventListener("mouseout", function () {
        var nestedList = this.getElementsByTagName("ul")[0];
        nestedList.classList.remove("menu-active");
    });
}

//---------- Language flag opaque

var languages = document.getElementsByClassName("languages__item");
for (var i = 0; i < languages.length; i++) {
    languages[i].addEventListener("click", function () {
        for (var i = 0; i < languages.length; i++){
            languages[i].classList.remove('active');
        }
            this.classList.add('active');
    });
}

//--------- Accordion right block
function handleClick() {
    var _contentAccordion = document.getElementsByClassName("accordion__content"),
        _buttonAccordion =  document.getElementsByClassName("accordion__button"),
        closeText = "Click to close",
        openText = "Click to open";

      if(this.classList.contains('active-icon')) {
        this.nextElementSibling.classList.remove("show");
        this.classList.remove("active-icon");
        this.innerHTML = openText;

    }else{
          for (i = 0; i < _buttonAccordion.length; i++) {
                   _buttonAccordion[i].classList.remove('active-icon');
                   _contentAccordion[i].classList.remove('show');
                   _buttonAccordion[i].innerHTML = openText;
          }
        this.nextElementSibling.classList.add("show");
        this.classList.add("active-icon");
        this.innerHTML = closeText;
    }
}

var accordion = document.getElementsByClassName("accordion__button");
     if(accordion){
        for (var i = 0; i < accordion.length; i++) {
            accordion[i].addEventListener('click',handleClick);
        }
    }


//------- AJAX

var xhr = new XMLHttpRequest();
xhr.open("GET", "MOCK_DATA.json", true);
xhr.send();
xhr.onreadystatechange = function() {
    if (this.readyState !== 4) return;
    if (this.status !== 200) {
        alert( xhr.status + ": " + xhr.statusText );
        var loadMessage = document.getElementById("loading");
        loadMessage.innerHTML = "SMTH WRONG";
        return;
    } else {
        var data = JSON.parse(xhr.responseText);
        buildTable(data);
    }
};

    //--------- adding table
    function buildTable(data) {

    var loadMessage = document.getElementById("display-table__block");
    loadMessage.innerHTML = "";
    loadMessage.classList.remove("display-table__block-remove");

    //--------- to call a function to determine width of cell

    var widthOfCell = toDetermineWidth(data[0]);

    //--------- to build a header of table

    var headerRow = toCreateHeaderRow(data[0]);



    function toDetermineWidth(header){
        var _count = 0;
        for (var index in header){
            _count++;
        }
        var _tableAll = document.getElementById("build"),
            _tWidth = _tableAll.offsetWidth,
            _equalWidth = _tWidth/_count,
            _width = _equalWidth/_tWidth*100 + "%"; //width for column according to count of columns
        return _width;
    }

    function toCreateHeaderRow(block){
        var _count = 0;
        var _row = document.createElement("div");
            _row.classList.add("table__row");
            _row.classList.add("table__row_header");

        for (var title in block) {
            var columnHeader = document.createElement("div");
            columnHeader.classList.add("table__data");
            columnHeader.classList.add("table__data_header");
            columnHeader.setAttribute("data-column", ++_count);
            columnHeader.innerHTML = title;
            columnHeader.style.width = widthOfCell;
            _row.appendChild(columnHeader);
        }
        return _row;
     }

    //----------- To build a table

    var tableToDraw = document.getElementById("display-table"),
        tableBody = document.createElement("div");
        tableToDraw.appendChild(headerRow);
        tableBody.classList.add("table__body");
        tableToDraw.appendChild(tableBody);

    //----------- to add cells

    var column;


    //----------- array scan forEach
  data.forEach(function(value){
             var count = 0,
                 buildData = function buildData(type, text) {
                     column = document.createElement("div");
                     column.classList.add("table__data");
                     column.setAttribute("data-column", ++count);  // count as closure
                     column.setAttribute("data-type", type);
                     column.innerHTML = text;
                 },
                newCell = document.createElement("div");
                newCell.classList.add("table__row");

        for (var el in value) {
            var elem = value[el];
                if (typeof elem !== "number") {
                    if (elem === null) {
                        buildData("string", "no data");

    //------------ search IMG PNG BMP

                    } else if (elem.toString().indexOf("png") !== -1 || elem.toString().indexOf("jpg") !== -1 || elem.toString().indexOf("bmp") !== -1) {
                        var image = document.createElement("img");
                        image.setAttribute("src", elem);
                        image.setAttribute("alt", "user-picture");
                        buildData("string", "");
                        column.appendChild(image);
                    } else {
                        buildData("string", elem);
                    }
                } else {
                    buildData("number", elem);
                }
                column.style.width = widthOfCell;
                newCell.appendChild(column);
                tableBody.appendChild(newCell);
            }
        });

    addSorter();
}

    //------------ to sort elements

function addSorter() {
    var tableToSort = document.getElementById("display-table"),
        tableToSortBody = tableToSort.querySelector(".table__body");

    function compare(a,b) {
        if (a.innerHTML < b.innerHTML)
            return -1;
        if (a.innerHTML > b.innerHTML)
            return 1;
        return 0;
    }

    function compareNumber(a,b) {
        return a.innerHTML - b.innerHTML
    }

    tableToSort.addEventListener("click", function(e) {
        var columnToCheck = e.target,
            dataClass = columnToCheck.className,
            headerClass = "table__data table__data_header",
            columnToCheckNumber = columnToCheck.getAttribute("data-column"),
            columnsToFind = tableToSortBody.getElementsByClassName("table__data"),
            arrToSort = [],
            arrToSortNum = [];

        if (dataClass !== headerClass) {
            return;
        }

        for(var i = 0; i < columnsToFind.length; i++){
            var checkedCell = columnsToFind[i],
                columnsToCheckNumber = checkedCell.getAttribute("data-column"),
                dataType = checkedCell.getAttribute("data-type");

            if(columnsToCheckNumber === columnToCheckNumber){
                if (dataType === "number") {
                    arrToSortNum.push(checkedCell);
                } else {
                    arrToSort.push(checkedCell);
                }
            }
        }

        if(arrToSortNum.length >= 1) {
            arrToSortNum.sort(compareNumber);
            for(var i = 0; i < arrToSortNum.length; i++) {
                tableToSortBody.appendChild(arrToSortNum[i].parentNode);
            }
        } else {
            arrToSort.sort(compare);
            for(var i = 0; i < arrToSort.length; i++) {
                tableToSortBody.appendChild(arrToSort[i].parentNode);
            }
        }

    });
}