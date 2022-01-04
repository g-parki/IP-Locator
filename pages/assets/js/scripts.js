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

const init_map = (lat, lon) => {
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC8EGp1Go1VHdXdMf8J_1jZD4Hr9YC9ePw&callback=initMap';
    script.async = true;

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

    document.head.appendChild(script);
      
}

$(document).ready(function() {
    $.ajax({
        url: 'https://rwzr72akp3.execute-api.us-west-2.amazonaws.com/Prod/ip-locator?asjson=1',
        type: 'GET',
        success: function(response) {
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
})
