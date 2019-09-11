<!DOCTYPE HTML>
<html>
    <head>
        <title>PingPong</title>
		<link href="style.css"  type="text/css"  rel="stylesheet">
    </head>
    <body onload="requestAnimationFrame(graj);">
        <h2>PingPong</h2>
        <canvas id="pingpong">Niestety, Twoja przeglądarka nie obsługuje obiektów typu Canvas.</canvas>
		<script type="text/javascript">
			var canvas = document.getElementById('pingpong');
			var ctx = canvas.getContext('2d');
		</script>
    </body>
</html>