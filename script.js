let draggableElements;
let listOfCourses = [
  'Django',
  'AngularJS',
  'Java',
  'React Js',
  'Vue js',
  'Python',
  'Javascript',
  'C sharp',
  'Mean Stack',
  'MongoDB',
];
let divContainer = document.getElementById('languageListContainer');
let list = document.getElementById('languageList');
let textArea = document.querySelector('.dragAndDropArea');
let selectedLanguageContainer =
  document.getElementById('selectedList');

document.addEventListener('DOMContentLoaded', (event) => {
  listOfCourses.sort();
  render(listOfCourses, 'div');
  draggableElements = document.querySelectorAll(
    '.individualLanguage',
  );
  draggableElements.forEach((draggable) => {
    draggable.addEventListener('dragstart', () => {
      draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
    });
  });
});

const searchHandler = (searchWord) => {
  let a = 0;
  for (i = 0; i < list.childNodes.length; i++) {
    if (
      !list.childNodes[i].childNodes[0].innerHTML
        .toLowerCase()
        .includes(searchWord)
    ) {
      list.childNodes[i].style.display = 'none';
      a++;
    } else list.childNodes[i].style.display = 'flex';
  }
  if (a === list.childNodes.length) {
    document
      .getElementById('emptySearchList')
      .classList.remove('displayNone');
    document
      .getElementById('emptySearchList')
      .classList.add('displayFlex');
  } else {
    document
      .getElementById('emptySearchList')
      .classList.remove('displayFlex');
    document
      .getElementById('emptySearchList')
      .classList.add('displayNone');
  }
};

const render = (array, elem) => {
  array.forEach((element, index) => {
    // creating separate div element for each language
    let individualLanguageContainer = document.createElement(elem);
    individualLanguageContainer.setAttribute('draggable', 'true');
    individualLanguageContainer.setAttribute(
      'class',
      'individualLanguage',
    );
    individualLanguageContainer.setAttribute(
      'id',
      `language${index + 1}`,
    );

    // Creating single div element, which hold language name as well as movable button
    let langNamewithDraggableButtonContainer =
      document.createElement(elem);
    langNamewithDraggableButtonContainer.setAttribute(
      'class',
      'languageNamewithDraggableButton',
    );

    // Creating span element for displaying language name
    let innerDiv = document.createElement('span');
    innerDiv.setAttribute('class', 'languageName');
    innerDiv.innerHTML = element;

    // Creating draggable button
    let dragAndDrop = document.createElement('button');

    let dragAndDropIcon = document.createElement('i');
    dragAndDropIcon.setAttribute('class', 'fas fa-grip-vertical');
    dragAndDrop.appendChild(dragAndDropIcon);

    // Creating delete button
    let deleteButton = document.createElement('button');
    deleteButton.style.visibility = 'hidden';

    let deleteIcon = document.createElement('i');
    deleteIcon.setAttribute('class', 'fas fa-trash');
    deleteButton.appendChild(deleteIcon);

    //Appending span element draggable and delete button to single div element
    langNamewithDraggableButtonContainer.appendChild(innerDiv);
    langNamewithDraggableButtonContainer.appendChild(dragAndDrop);
    individualLanguageContainer.appendChild(
      langNamewithDraggableButtonContainer,
    );
    individualLanguageContainer.appendChild(deleteButton);

    // Appending that single div element to the list div
    list.appendChild(individualLanguageContainer);

    // Mouse EventListener functionalities
    individualLanguageContainer.addEventListener('mouseover', (e) => {
      if (
        individualLanguageContainer.parentElement.id ===
        'selectedList'
      )
        deleteButton.style.visibility = 'visible';
    });

    individualLanguageContainer.addEventListener('mouseout', (e) => {
      deleteButton.style.visibility = 'hidden';
    });

    //Click eventlistenser functionalities
    deleteButton.addEventListener('click', (e) => {
      let numberPattern = /[0-9]/g;
      let separateNumberFromID =
        deleteButton.parentElement.id.match(numberPattern);
      let parsingInt =
        parseInt(
          separateNumberFromID.reduce((acc, ele) => acc + ele),
        ) + 1;
      // While user deletes the language from selected area, it should place in ascending order in Language list area
      while (parsingInt <= listOfCourses.length) {
        if (
          document.querySelectorAll(
            `#languageList #language${parsingInt}`,
          ).length
        ) {
          list.insertBefore(
            individualLanguageContainer,
            document.querySelectorAll(
              `#languageList #language${parsingInt}`,
            )[0],
          );
          return;
        }
        parsingInt += 1;
      }
      list.appendChild(individualLanguageContainer);
    });
  });
};

// Textarea element
textArea.addEventListener('dragenter', (e) => {
  e.preventDefault();
  const draggable = document.querySelector('.dragging');
  selectedLanguageContainer.appendChild(draggable);
});

//Dragover functionalites
selectedLanguageContainer.addEventListener('dragover', (e) => {
  e.preventDefault();
  const afterElement = getNextElement(
    selectedLanguageContainer,
    e.clientY,
  );
  const draggable = document.querySelector('.dragging');
  if (afterElement == null) {
    selectedLanguageContainer.appendChild(draggable);
  } else {
    selectedLanguageContainer.insertBefore(draggable, afterElement);
  }
});

const getNextElement = (container, currentmousePointerPosition) => {
  // Finding out the languages which is not currently dragging by user in SelectedList area
  const unClickedElements = [
    ...container.querySelectorAll(
      '.individualLanguage:not(.dragging)',
    ),
  ];
  return unClickedElements.reduce(
    (closestElement, childNode, index) => {
      // Identifying position of each and every elements in SelectedList area
      const rectBox = childNode.getBoundingClientRect();
      const offset =
        currentmousePointerPosition -
        rectBox.top -
        rectBox.height / 2;
      if (offset < 0 && offset > closestElement.offset) {
        return { offset: offset, element: childNode };
      } else {
        return closestElement;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
};
