"strict";
// global variables
const globalVariables = (() => {
  uniqueId = 0;
  openSheetClicked = false;
  isItemClicked = false;
  prevItem = null;
})();

var adobeReady = false;
document.addEventListener("adobe_dc_view_sdk.ready", function () {
  adobeReady = true;
});

// copied from somewhere (written in references)
function callAdobeApi(PDFObject) {
  if (!adobeReady) {
    // Adobe SDK not ready yet. Try again in 200ms.
    setTimeout(function () {
      changeDoc();
    }, 200);
    return;
  }

  var adobeDCView = new AdobeDC.View({ clientId: "56bd9cfc05f9496bb75307708a493ca3", divId: "adobe-dc-view" });
  adobeDCView.previewFile(
    {
      content: {
        location: {
          url: PDFObject.url,
        },
      },
      metaData: {
        fileName: PDFObject.fileName,
      },
    },
    {
      embedMode: "FULL_WINDOW",
      defaultViewMode: "FIT_WIDTH",
    }
  );
}

class embedMedia {
  constructor(title, author, type, url) {
    this.title = title;
    this.author = author;
    this.type = type;
    this.url = url;
    this.id = uniqueId++;
  }
}

class PDF extends embedMedia {
  constructor(title, author, type, url, fileName) {
    super(title, author, type, url);
    this.fileName = fileName;
  }
}

class Website extends embedMedia {
  constructor(title, author, type, url) {
    super(title, author, type, url);
  }
}

const PDFCollection = [
  new PDF("Simple JavaScript Cheatsheet", "iloveCoding", "javascript", "cheatsheets/JavaScript/js-cheatsheet-2.pdf", "js-cheatsheet-2.pdf"),
  new PDF("Beginner's Essential", "WebsiteSetup", "javascript", "cheatsheets/JavaScript/JS_Cheat_1667421241.pdf", "JS_Cheat_1667421241.pdf"),
  new PDF("Complete JavaScript CheatSheet", "PAPA REACT", "javascript", "cheatsheets/JavaScript/JS__1667799823.pdf", "JS__1667799823.pdf"),
  new PDF("CSS Cheatsheet", "iloveCoding", "css", "cheatsheets/css-cheatsheet.pdf", "css-cheatsheet.pdf"),
  new PDF("The Complete HTML Cheat Sheet", "Hostinger", "html", "cheatsheets/html-cheatsheet.pdf", "html-cheatsheet.pdf"),
  new PDF("Git Cheat Sheet", "Atlassian", "git", "cheatsheets/git-cheatsheet.pdf", "git-cheatsheet.pdf"),
];

const WebsiteCollection = [
  new Website("Learn JavaScript", "Codecademy", "javascript", "https://www.codecademy.com/learn/introduction-to-javascript/modules/learn-javascript-introduction/cheatsheet"),
  new Website("CSS Grid cheatsheet", "Rico's cheatsheets", "css", "https://devhints.io/css-grid"),
];

console.log(PDFCollection[0].title);

const openWebsite = (e) => {
  // we left off from here
  const websiteObject = e.target.websiteObject;

  if (!isItemClicked) {
    // make the pdf element
    createWebsiteElement();
  } else {
    document.querySelectorAll(".website-item").forEach((el) => {
      el.remove();
    });
    if (prevItem !== websiteObject) {
      createWebsiteElement();
    } else {
      isItemClicked = false;
    }
  }
  function createWebsiteElement() {
    const cheatsheetsItem = document.createElement("embed");
    console.log(websiteObject.url);
    cheatsheetsItem.setAttribute("src", websiteObject.url);
    cheatsheetsItem.classList.add("website-item");
    e.target.after(cheatsheetsItem);
    isItemClicked = true;
  }
  prevItem = websiteObject;
};

const openPDF = (e) => {
  // get the pdf object selected
  const PDFObject = e.currentTarget.PDFObject;
  const cheatsheetsItem = e.currentTarget;
  if (!isItemClicked) {
    // make the pdf element
    createPDFElements();
  } else {
    document.querySelectorAll("#adobe-dc-view").forEach((el) => {
      el.remove();
    });
    if (prevItem !== PDFObject) {
      createPDFElements();
    } else {
      isItemClicked = false;
    }
  }
  function createPDFElements() {
    const pdfElement = document.createElement("div");
    // give pdfElement the id
    pdfElement.id = "adobe-dc-view";
    // put pdf element after clicked cheatsheetItem
    cheatsheetsItem.after(pdfElement);
    // pass the current PDFObject
    callAdobeApi(PDFObject);
    isItemClicked = true;
  }
  prevItem = PDFObject;
};

// function called when a type of cheatsheet is picked i.e javascript
const openSheet = (clickedId) => {
  // you can't click the button again
  if (!openSheetClicked) {
    // retrieve selected div element (or the type of cheatsheet that was clicked)
    const clickedElement = document.querySelector(`#${clickedId}`);
    // retrieve the website elements
    for (let i = 0; i < WebsiteCollection.length; i++) {
      if (WebsiteCollection[i].type === clickedId) {
        const cheatsheetsItem = document.createElement("div");
        cheatsheetsItem.addEventListener("click", openWebsite);
        cheatsheetsItem.classList.add("cheatsheetItem");
        cheatsheetsItem.classList.add("cheatsheetWebsite");
        cheatsheetsItem.websiteObject = WebsiteCollection[i];
        cheatsheetsItem.innerHTML = `<h3>${WebsiteCollection[i].title}</h3>
        <h4><i>by ${WebsiteCollection[i].author}</i></h4>`;
        clickedElement.after(cheatsheetsItem);
      }
    }
    // retrieve the pdfs elements
    for (let i = 0; i < PDFCollection.length; i++) {
      // find pdfs that matched the selected div
      if (PDFCollection[i].type === clickedId) {
        // create div inside of the cheatsheet item for that element
        const cheatsheetsItem = document.createElement("div");
        // give it a class
        cheatsheetsItem.classList.add("cheatsheetItem");
        // add event listener
        cheatsheetsItem.addEventListener("click", openPDF);
        // make a parameter called PDFObject and pass the current PDFObject
        cheatsheetsItem.PDFObject = PDFCollection[i];
        // make html to be appended to the div
        cheatsheetsItem.innerHTML = `<h3>${PDFCollection[i].title}</h3>
        <h4><i>by ${PDFCollection[i].author}</i></h4>
        `;
        // add the new elements after the clicked element
        clickedElement.after(cheatsheetsItem);
      }
    }
    openSheetClicked = true;
  } else {
    document.querySelectorAll(".cheatsheetItem").forEach((el) => {
      el.remove();
    });
    document.querySelectorAll("#adobe-dc-view").forEach((el) => {
      el.remove();
    });
    openSheetClicked = false;
  }
};
