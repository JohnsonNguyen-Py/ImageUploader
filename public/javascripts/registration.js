var username = document.getElementById("Username")
var user_Pw = document.getElementById("Password")
var user_Email = document.getElementById("Reg_Email")
var confirm_Pw = document.getElementById("Password")
var form = document.getElementById("form")
var errUsername = document.getElementById("errUsername")
var errPassword = document.getElementById("errPassword")
var errmsg = document.getElementById("errBox")

user_Pw.onchange = function (e) {
    if (password.value.length > 0) {
        if (password.value != confirm_Pw.value) {
            errPassword.innerHTML = `<br/><br/><br/><br/><a class="etext"> ✖ Passwords do not match</a><br/>`;
            alert("Passwords do not match")
        } else {
            errPassword.innerHTML = `<br/><br/><br/><br/><a class="success"> ✔ Password</a><br/>`;
        }
    }
};

form.addEventListener("change", (e) => {
    let messages = [];
    if (user_Pw.value != confirm_Pw.value) {
        messages.push(
            `<br/><br/><br/><br/><a class="etext"> ✖ Passwords do not match</a><br/>`
        );
    }

    if (messages.length > 0) {
        e.preventDefault();
        errmsg.style.display = "initial";
        var a = messages;
        console.log(`"${a}"`);
        errmsg.innerHTML = `${a}`;
    } else {
        errmsg.innerHTML = `<br/><br/><br/><br/><a class="success"> ✔ Password</a><br/>`;
    }
});

user_Pw.onchange = function (e) {

    var regex = /^[A-Za-z][A-Za-z0-9]+$/;
    if (user.value.match(regex)) {
        errUsername.innerHTML = `<br/><br/><br/><br/><a class="success"> ✔ Username</a><br/>`;
    } else {
        errUsername.innerHTML = `<br/><br/><br/><br/><a class="etext"> ✖ Username</a><br/>`;
        alert("Username already exists")
    }
};


