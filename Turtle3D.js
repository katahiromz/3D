// 三次元タートルグラフィックス。
function Turtle3D(scene) {
    this.scene = scene;
    this.position = new THREE.Vector3();
    this.enable_pen = true;
    this.line_width = 0;
    this.line_color = 0xffffff;
    this.fill_color = 0x888888;
    this.gyro = new THREE.Matrix3();

    // ラジアンから度へ変換する関数。
    this.rad2deg = function(rad) {
        return rad * 180.0 / Math.PI;
    }
    // 度からラジアンへ変換する関数。
    this.deg2rad = function(degree) {
        return degree * Math.PI / 180.0;
    }

    // 位置をリセットする関数。
    this.reset_pos = function() {
        this.position = new THREE.Vector3();
    };
    // X軸の方向を見る関数。
    this.look_x = function() {
        this.gyro.set(
            1, 0, 0,
            0, 0, 1,
            0, 1, 0);
    };
    // Y軸の方向を見る関数。
    this.look_y = function() {
        this.gyro.set(
            0, 1, 0,
            1, 0, 0,
            0, 0, 1);
    };
    // Z軸の方向を見る関数。
    this.look_z = function() {
        this.gyro.set(
            0, -1, 0,
            0, 0, 1,
            1, 0, 0);
    };

    // リセットする関数。
    this.reset = function() {
        this.reset_pos();
        this.look_y();
        this.line_color = 0xffffff;
        this.fill_color = 0x888888;
        this.line_width = 0;
    };
    this.reset();

    // 位置を取得・セットする関数。
    this.get_pos = function() {
        return this.position.clone();
    }
    this.set_pos = function(x, y, z) {
        this.position = new THREE.Vector3(x, y, z);
    }

    // 向きを取得する関数。
    this.get_dir = function() {
        return new THREE.Vector3(
            this.gyro.elements[0],
            this.gyro.elements[1],
            this.gyro.elements[2]);
    }
    // ジャイロを取得する関数。
    this.get_gyro = function() {
        return this.gyro.clone();
    }

    // 位置とジャイロを取得・セットする関数。
    this.get_pg = function() {
        return [this.get_pos(), this.get_gyro()];
    }
    this.set_pg = function(pg) {
        this.position = pg[0];
        this.gyro = pg[1];
    }

    // 線を追加する関数。
    this.add_line = function(pos0, pos1, line_width = this.line_width, line_color = this.line_color) {
        if (line_width == 0) {
            var points = [];
            points.push(pos0);
            points.push(pos1);
            var geometry = new THREE.BufferGeometry().setFromPoints(points);
            var material = new THREE.LineBasicMaterial({ color: line_color });
            var lines = new THREE.Line(geometry, material);
            this.scene.add(lines);
        } else {
            var segments = 1, radiusSegments = 3;
            var pointsArray = new THREE.LineCurve3(pos0, pos1);
            var geometry = new THREE.TubeGeometry(pointsArray, segments, line_width, radiusSegments, false, true);
            var material = new THREE.MeshBasicMaterial( { color: line_color } );
            var lines = new THREE.Mesh(geometry, material);
            this.scene.add(lines);
        }
    }
    // 三角形を追加する関数。
    this.add_triangle = function(pos0, pos1, pos2, fill_color = this.fill_color) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(pos0);
        geometry.vertices.push(pos1);
        geometry.vertices.push(pos2);
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        var material = new THREE.MeshBasicMaterial({color: fill_color});
        var triangle = new THREE.Mesh(geometry, material);
        this.scene.add(triangle);
    }

    // 長さdistanceだけ前進する。enable_penがtrueなら線を描画する。
    this.walk = function(distance, enable_pen = this.enable_pen) {
        var dir = this.get_dir();
        if (enable_pen) {
            var pos0 = this.get_pos();
            this.position.addScaledVector(dir, distance);
            var pos1 = this.get_pos();
            this.add_line(pos0, pos1);
        } else {
            this.position.addScaledVector(dir, distance);
        }
    }

    // 亀の右手方向にangle度曲がる関数。マイナスは左手方向。
    this.turn = function(angle) {
        var rad = this.deg2rad(angle);
        var rot = new THREE.Matrix3();
        rot.set(
            Math.cos(rad), -Math.sin(rad), 0,
            Math.sin(rad), Math.cos(rad), 0,
            0, 0, 1);
        this.gyro.multiply(rot);
    }

    // 亀の進行方向を軸として反時計回りにangle度曲がる関数。マイナスは時計回り。
    this.spin = function(angle) {
        var rad = this.deg2rad(angle);
        var rot = new THREE.Matrix3();
        rot.set(
            1, 0, 0,
            0, Math.cos(rad), -Math.sin(rad),
            0, Math.sin(rad), Math.cos(rad));
        this.gyro.multiply(rot);
    }

    // 亀のお辞儀方向にangle度曲がる関数。
    this.pitch = function(angle) {
        var rad = this.deg2rad(angle);
        var rot = new THREE.Matrix3();
        rot.set(
            Math.cos(rad), 0, Math.sin(rad),
            0, 1, 0,
            -Math.sin(rad), 0, Math.cos(rad));
        this.gyro.multiply(rot);
    }
}
