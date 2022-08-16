const host = "http://localhost:5000/";

document.querySelector("#create-short-url").addEventListener("click", () => {
    let longurl = document.querySelector("#longurl").value.trim();
    if(longurl.length == 0) {
        alert("Enter valid url");
        return;
    } else if(!(longurl.startsWith("http://") || longurl.startsWith("https://"))){
        alert("Enter valid link");
        return;
    }


    fetch(host + "api/create-short-url", {
        method: "POST",
        body: JSON.stringify({
            longurl:longurl
        }),
        headers: {
            "content-type": "application/json; charset=UTF-8"
        }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        if(data.status == "ok"){
            document.querySelector("#short-url").innerText = "http://" + data.shorturlid;
            document.querySelector("#short-url").href = data.shorturlid;
            let html = `
                <tr>
                    <td>${longurl}</td>
                    <td>${host}${data.shorturlid}</td>
                    <td>${0}</td>
                </tr>
            `;
            document.querySelector("#list_urls tbody").innerHTML += html;
        };
    }).catch((err) => {
        alert("Something went wrong");
    })
});


(() => {
    fetch(host + "api/get-all-short-urls").then((res) => {
        return res.json();
    }).then((data) => {
        let html = "";
        for(let i=0; i<data.length; i++){
            html += ` 
                <tr>
                    <td>${data[i].longurl}</td>
                    <td>${host}${data[i].shorturlid}</td>
                    <td>${data[i].count}</td>
                </tr>
            `;
        }
        document.querySelector("#list_urls tbody").innerHTML = html;
    }).catch((err) => {
        alert("Something went wrong");
    })
})();