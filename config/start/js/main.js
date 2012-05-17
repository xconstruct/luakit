function zero_pad(number) {
	return (number < 10 ? '0' : '') + number;
}

function updateClock() {
	var time = new Date();

	var weekday = [ "Sunday", "Monday", "Tuesday", "Wednesday",
	                "Thursday", "Friday", "Saturday", "Sunday" ];
	var month = [ "January", "February", "March", "April", "May", "June",
	              "July", "August", "September", "October", "November", "December" ];

	$('#clock_hour').text(zero_pad(time.getHours()));
	$('#clock_min').text(zero_pad(time.getMinutes()));
	$('#clock_date').html(
		weekday[time.getDay()] + "<br />"
		+ month[time.getMonth()] + " ."
		+ zero_pad(time.getDate())
	);
}

function updateMensa(element, title, where) {
	$.get("http://www.stwh-portal.de/mensa/index.php?wo="+where+"&wann=1&format=txt", function(data) {
		var date = data.match(/^# (.+) #$/m)[1];

		var content = "<ul>";
		var foodRegex = /^[>|] (.+)$/mg;
		var match = foodRegex.exec(data);
		while (match != null) {
			var food = match[1];
			match = foodRegex.exec(data);

			var parts = food.match(/\s*(.+):\s*([^(]+)\s*.*$/);
			if (parts == null)
				continue;

			var type = parts[1];
			var name = parts[2];
			if (type.match(/Abendessen/))
				continue;
			if (name.match(/Tagessuppe|Buffet|Aktionsmenüs/))
				continue;
			if (type.match(/Gemüse|Dessert|Salat|Suppe/))
				continue;
			if (type.match(/Wahlmenü/))
				type = type.match(/Wahlmenü \((.+)\)/)[1];

			name = name.replace(/\s*\(.*\)\s*/g, '');
			content += '<li><b>// ' + type + '<br />'
				       + '<a href="https://www.google.com/search?hl=en&tbm=isch&q='+name+'">'+name+'</a></li>';
		}
		content += "</ul>";
		$(element + ' .content').html(content);
		$(element + ' h1').text(title + " // " + date);
	});
}

function updateMensaAll() {
	updateMensa('#mensa', "Mensa", 2);
	updateMensa('#contine', "Contine", 3);
}

function updateMail() {
	$.get("https://mail.google.com/mail/feed/atom/", function(data) {
		var content = "<ul>";
		$(data).find('entry').each(function(i, el) {
			var title = $(el).find('title').text();
			var name = $(el).find('author name').text();
			content += "<li><b>// " + name + "</b><br />" + title + "</li>";
		});
		content += "</ul>";
		$('#mail .content').html(content);
		$('#mail h1').text("Mail");
	});
}

function updateReader() {
	$.get("http://www.google.com/reader/atom/user/-/state/com.google/reading-list?xt=user/-/state/com.google/read", function(data) {
		var content = "<ul>";
		$(data).find('entry').each(function(i, el) {
			var title = $(el).children('title').text();
			var sourceName = $(el).find('source title').text();
			content += "<li><b>" + sourceName + "</b> // "+ title + "</li>";
		});
		$('#reader .content').html(content);
		$('#reader h1').html("Reader");
	});
}

$(function() {
	updateClock();
	window.setInterval(updateClock, 1000*10);
	updateMensaAll();
	updateMail();
	window.setInterval(updateMail, 1000*60);
	updateReader();
});
