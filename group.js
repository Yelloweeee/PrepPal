function copyLink() {
    // Get the input field
    var copyText = document.getElementById("shareLink");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the input field
    document.execCommand("copy");

    // Alert the copied text
    alert("Link copied: " + copyText.value);
}