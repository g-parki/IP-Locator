const render_ip = (ip_info) => {
    const {latitude, longitude} = ip_info
    $('#ip-locator-demo')
        .append(render_line("Your IP", ip_info['ip']))
        .append(render_line("City", ip_info['city']))
        .append(render_line("ZIP", ip_info['zip']))
        .append(render_line("Region", ip_info['regionName']))
        .append(render_line("Country", ip_info['country']))
        .append(render_line("Latitude", latitude))
        .append(render_line("Longitude", longitude))
        .append(render_line("ISP", ip_info['isp']))
    init_map(Number(latitude), Number(longitude))
}

const render_line = (title, data) => {
    return '<p style="text-align:right;margin-top: 3px;margin-bottom: auto;">' +
    `<span style="float:left;padding-right: 4px;"><b>${title}: </b></span>${data}</p>`
}

let maps_loaded = false

const init_map = (lat, lon) => {
    window.initMap = () => {
        const coords = {lat: lat, lng: lon}
        const map = new google.maps.Map(document.getElementById('map'), {
            center: coords,
            zoom: 12,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            mapTypeId: "hybrid",
          });
        
          new google.maps.Marker({
            position: coords,
            map,
          });
    };

    if (!maps_loaded) {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC8EGp1Go1VHdXdMf8J_1jZD4Hr9YC9ePw&callback=initMap';
        script.async = true;
        document.head.appendChild(script);
        maps_loaded = true;
    }
}

const request_ip = (ip) => {
    let url = 'https://rwzr72akp3.execute-api.us-west-2.amazonaws.com/Prod/ip-locator?asjson=1'
    if (ip !== undefined) {
        url = url + `&ip=${ip}`
    }

    $.ajax({
        url: url,
        type: 'GET',
        success: function(response) {
            $('#ip-locator-demo').empty()
            if (typeof(response) == 'string') {
                render_ip(JSON.parse(response))
            } else {
                render_ip(response)
            }
            
        },
        error: function(error) {
            console.log(error);
        }
    });
}

const submit_form = (form) => {
    const val = $('#ip-input').val()
    request_ip(val)
}

const is_valid_ip = (ipaddress) => {  
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)     
}

const render_ip_input = () => {
    const val = $('#ip-input').val()
    if (val == "" || !is_valid_ip(val)) {
        disable_form()
    } else {
        enable_form()
    }
}

const enable_form = () => {
    if ($('#submit-button').hasClass('disabled')) {
        $('#submit-button').removeClass('disabled')
        $('#submit-button').on('click', submit_form)
        $('#ip-input').on('keyup', function(event) {
            if (event.keyCode === 13) {
                submit_form()
            }
        })
    }
}

const disable_form = () => {
    if (!$('#submit-button').hasClass('disabled')) {
        $('#submit-button').addClass('disabled')
        $('#ip-input').off('keyup')
        $('#submit-button').off()
    }
}

$(document).ready(function() {
    request_ip()
    console.log($('#ip-input').val())
    $('#ip-input').on('input', render_ip_input)
})

