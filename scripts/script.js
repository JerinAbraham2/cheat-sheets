"strict";
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

let uniqueId = 0;

class PDF {
  constructor(title, author, type, url, fileName) {
    this.title = title;
    this.author = author;
    this.type = type;
    this.id = uniqueId++;
    this.url = url;
    this.fileName = fileName;
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

console.log(PDFCollection[0].title);

let openSheetClicked = false;
let openPdfClicked = false;
let prevPDFId = null;

const openPDF = (e) => {
  // get the pdf object selected
  const PDFObject = e.currentTarget.PDFObject;
  const cheatsheetsItem = e.currentTarget;
  const prevPDFObjectId = e.currentTarget.prevPDFObjectId;
  console.log(prevPDFObjectId);
  if (!openPdfClicked) {
    // make the pdf element
    createPDFElements();
  } else {
    document.querySelectorAll("#adobe-dc-view").forEach((el) => {
      el.remove();
    });
    if (prevPDFId !== PDFObject) {
      createPDFElements();
    } else {
      openPdfClicked = false;
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
    openPdfClicked = true;
  }
  prevPDFId = PDFObject;
};

const openSheet = (clickedId) => {
  console.log(clickedId);
  // you can't click the button again
  if (!openSheetClicked) {
    // retrieve selected div element (or the div of the button that was clicked)
    const clickedElement = document.querySelector(`#${clickedId}`);
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
        // also pass the previous object id
        cheatsheetsItem.prevPDFObjectId = PDFCollection[i];

        // give an ID to each individual PDF

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
