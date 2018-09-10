(function () {

    function $(id) {
        return document.getElementById(id);
    }

    window.onload = function() {
        getInfo();
    }

    function getInfo() {
        let name = getUserInfo();     
    }

    function getUserInfo() {
        // $("login").style.display = "flex";
        // $("enter").onclick = function () {
        //     if ($("name").value) {
        //         let nm = $("name").value;
        //         $("login").style.display = "none";
        //         sendData(nm);
        //     }
        // }
        sendData(1);
    }

    function sendData(nm) {
        if (nm) {
            let data = new FormData();
            
            fetch ("https://api.ipify.org")
                .then(checkStatus)
                .then(function (response) {
                    data.append("ip", response);
                })
            data.append("userInfo", name);

            fetch ("./log.php", {method: "POST", body: data})
        }   
    }

    function checkStatus (response) {
        if (response.status >= 200 && response.status <= 300) {
            return response.text();
        } else {
            return Promise.reject(new Error(response.status+": "+response.statusText));
        }
    }

})();