function copy(copyId){
    const inputElement = document.createElement("input");
    const copyText = document.getElementById(copyId).innerHTML;
    
    inputElement.value = copyText;
    document.body.appendChild(inputElement)
    inputElement.select()
    document.execCommand('copy')
    document.body.removeChild(inputElement)

    const alertBox =  document.querySelector(".alertBox")
    
    alertBox.classList.add("alert-on")

    setTimeout( () => {
       alertBox.classList.remove("alert-on")
    }, 1500)
}