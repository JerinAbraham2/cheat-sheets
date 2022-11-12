document.addEventListener("adobe_dc_view_sdk.ready", function () {
  var adobeDCView = new AdobeDC.View({ clientId: "56bd9cfc05f9496bb75307708a493ca3", divId: "adobe-dc-view" });
  adobeDCView.previewFile({
    content: { location: { url: "cheatsheets/css-cheatsheet.pdf" } },
    metaData: { fileName: "css-cheatsheet.pdf" },
  });
});