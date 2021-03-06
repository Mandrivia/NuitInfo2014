function goto_controller() {
	document.location.href = "controller/";
}

function goto_display() {
	document.location.href = "display/";
}

function checkEvent(event) {
	if(event.alpha != null) {
		window.removeEventListener('deviceorientation', checkEvent);
		goto_controller();
	}
	else {
		window.removeEventListener('deviceorientation', checkEvent);
		goto_display();
	}
}

function main() {
	if(window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', checkEvent, false);
		var timeout_api = setTimeout(function () {
			goto_display();
			window.removeEventListener('deviceorientation', checkEvent);
		}, 1000);
	} else {
		goto_display();
	}
}
