// ПОЛНОСТЬЮ ОБНОВЛЕННАЯ 3D СЦЕНА С ДЕТАЛИЗИРОВАННЫМ ОКРУЖЕНИЕМ
// Замените весь файл 3d-scene.js этим кодом

class Medical3DScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.ambulance = null;
        this.lights = [];
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        this.wheels = [];
        this.blueLamps = [];
        this.headlights = [];
        this.init();
    }

    init() {
        console.log('🚑 Создаем МАКСИМАЛЬНО реалистичную медицинскую сцену...');
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createEnvironment();
        this.createDetailedAmbulance();
        this.createHospitalBuilding();
        this.createRoadAndTraffic();
        this.createAtmosphere();
        this.createReflections();
        this.setupEventListeners();
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
        
        // Реалистичный туман
        this.scene.fog = new THREE.Fog(0x1a1a2e, 20, 150);
        
        // Градиентный фон (небо)
        const skyGeometry = new THREE.SphereGeometry(200, 32, 32);
        const skyMaterial = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0f0f1a) },
                bottomColor: { value: new THREE.Color(0x2a2a4e) },
                offset: { value: 33 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(
            50, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(20, 12, 25);
        this.camera.lookAt(0, 2, 0);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        
        const container = document.createElement('div');
        container.id = 'threejs-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;
        
        container.appendChild(this.renderer.domElement);
        document.body.appendChild(container);
    }

    createEnvironment() {
        // Детализированная дорога
        this.createDetailedRoad();
        
        // Тротуары
        this.createSidewalks();
        
        // Освещение
        this.createLighting();
        
        // Здания на заднем плане
        this.createBackgroundBuildings();
        
        // Деревья и растительность
        this.createVegetation();
    }

    createDetailedRoad() {
        // Основа дороги
        const roadGeometry = new THREE.PlaneGeometry(120, 30);
        const roadMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2a2a2a,
            transparent: true,
            opacity: 0.9
        });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.receiveShadow = true;
        this.scene.add(road);

        // Дорожная разметка
        this.createRoadMarkings();

        // Обочины
        const shoulderGeometry = new THREE.PlaneGeometry(120, 5);
        const shoulderMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x3a3a3a,
            transparent: true,
            opacity: 0.8
        });
        
        const leftShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        leftShoulder.rotation.x = -Math.PI / 2;
        leftShoulder.position.set(0, 0.01, 17.5);
        leftShoulder.receiveShadow = true;
        this.scene.add(leftShoulder);

        const rightShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        rightShoulder.rotation.x = -Math.PI / 2;
        rightShoulder.position.set(0, 0.01, -17.5);
        rightShoulder.receiveShadow = true;
        this.scene.add(rightShoulder);

        // Земля по бокам
        const grassGeometry = new THREE.PlaneGeometry(120, 40);
        const grassMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1a4a1a,
            transparent: true,
            opacity: 0.7
        });
        
        const leftGrass = new THREE.Mesh(grassGeometry, grassMaterial);
        leftGrass.rotation.x = -Math.PI / 2;
        leftGrass.position.set(0, -0.01, 40);
        leftGrass.receiveShadow = true;
        this.scene.add(leftGrass);

        const rightGrass = new THREE.Mesh(grassGeometry, grassMaterial);
        rightGrass.rotation.x = -Math.PI / 2;
        rightGrass.position.set(0, -0.01, -40);
        rightGrass.receiveShadow = true;
        this.scene.add(rightGrass);
    }

    createRoadMarkings() {
        // Центральная линия
        for (let i = -50; i < 50; i += 4) {
            const markingGeometry = new THREE.PlaneGeometry(2, 0.2);
            const markingMaterial = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.9
            });
            const marking = new THREE.Mesh(markingGeometry, markingMaterial);
            marking.rotation.x = -Math.PI / 2;
            marking.position.set(i, 0.02, 0);
            this.scene.add(marking);
        }

        // Боковые линии
        const sideLineGeometry = new THREE.PlaneGeometry(120, 0.15);
        const sideLineMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const leftLine = new THREE.Mesh(sideLineGeometry, sideLineMaterial);
        leftLine.rotation.x = -Math.PI / 2;
        leftLine.position.set(0, 0.02, 15);
        this.scene.add(leftLine);

        const rightLine = new THREE.Mesh(sideLineGeometry, sideLineMaterial);
        rightLine.rotation.x = -Math.PI / 2;
        rightLine.position.set(0, 0.02, -15);
        this.scene.add(rightLine);
    }

    createSidewalks() {
        const sidewalkGeometry = new THREE.BoxGeometry(120, 0.3, 3);
        const sidewalkMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x606060,
            roughness: 0.8
        });

        const leftSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
        leftSidewalk.position.set(0, 0.15, 21.5);
        leftSidewalk.castShadow = true;
        leftSidewalk.receiveShadow = true;
        this.scene.add(leftSidewalk);

        const rightSidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
        rightSidewalk.position.set(0, 0.15, -21.5);
        rightSidewalk.castShadow = true;
        rightSidewalk.receiveShadow = true;
        this.scene.add(rightSidewalk);
    }

    createLighting() {
        // Основной солнечный свет
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(50, 50, 30);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 4096;
        sunLight.shadow.mapSize.height = 4096;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 200;
        sunLight.shadow.camera.left = -50;
        sunLight.shadow.camera.right = 50;
        sunLight.shadow.camera.top = 50;
        sunLight.shadow.camera.bottom = -50;
        this.scene.add(sunLight);

        // Окружающий свет
        const ambientLight = new THREE.AmbientLight(0x404060, 0.4);
        this.scene.add(ambientLight);

        // Уличные фонари
        this.createStreetLights();

        // Прожекторы скорой помощи
        this.createAmbulanceLights();
    }

    createStreetLights() {
        const lightPositions = [
            { x: -30, z: 25 },
            { x: -10, z: 25 },
            { x: 10, z: 25 },
            { x: 30, z: 25 },
            { x: -30, z: -25 },
            { x: -10, z: -25 },
            { x: 10, z: -25 },
            { x: 30, z: -25 }
        ];

        lightPositions.forEach(pos => {
            // Столб
            const poleGeometry = new THREE.CylinderGeometry(0.1, 0.15, 8, 8);
            const poleMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
            const pole = new THREE.Mesh(poleGeometry, poleMaterial);
            pole.position.set(pos.x, 4, pos.z);
            pole.castShadow = true;
            this.scene.add(pole);

            // Светильник
            const lightGeometry = new THREE.SphereGeometry(0.3, 12, 8);
            const lightMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xffffaa,
                emissive: 0x444400,
                transparent: true,
                opacity: 0.8
            });
            const lightBulb = new THREE.Mesh(lightGeometry, lightMaterial);
            lightBulb.position.set(pos.x, 8.2, pos.z);
            this.scene.add(lightBulb);

            // Свет от фонаря
            const streetLight = new THREE.PointLight(0xffffaa, 0.5, 20);
            streetLight.position.set(pos.x, 8, pos.z);
            streetLight.castShadow = true;
            this.scene.add(streetLight);
        });
    }

    createAmbulanceLights() {
        // Синие мигающие огни
        this.blueLight1 = new THREE.PointLight(0x0066ff, 0, 20);
        this.blueLight1.position.set(-0.7, 4.5, 0);
        this.scene.add(this.blueLight1);

        this.blueLight2 = new THREE.PointLight(0x0066ff, 0, 20);
        this.blueLight2.position.set(0.7, 4.5, 0);
        this.scene.add(this.blueLight2);

        // Белые фары
        this.headLight1 = new THREE.SpotLight(0xffffaa, 1.2, 40, Math.PI / 8, 0.2);
        this.headLight1.position.set(4, 1.2, -1);
        this.headLight1.target.position.set(15, 0, -1);
        this.headLight1.castShadow = true;
        this.scene.add(this.headLight1);
        this.scene.add(this.headLight1.target);

        this.headLight2 = new THREE.SpotLight(0xffffaa, 1.2, 40, Math.PI / 8, 0.2);
        this.headLight2.position.set(4, 1.2, 1);
        this.headLight2.target.position.set(15, 0, 1);
        this.headLight2.castShadow = true;
        this.scene.add(this.headLight2);
        this.scene.add(this.headLight2.target);
    }

    createBackgroundBuildings() {
        // Больница
        const hospitalGeometry = new THREE.BoxGeometry(15, 12, 8);
        const hospitalMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xf0f0f0,
            shininess: 30
        });
        const hospital = new THREE.Mesh(hospitalGeometry, hospitalMaterial);
        hospital.position.set(-40, 6, 35);
        hospital.castShadow = true;
        hospital.receiveShadow = true;
        this.scene.add(hospital);

        // Окна больницы
        this.createHospitalWindows(hospital);

        // Крест на больнице
        const crossGeometry = new THREE.BoxGeometry(1, 3, 0.2);
        const crossMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const hospitalCrossV = new THREE.Mesh(crossGeometry, crossMaterial);
        hospitalCrossV.position.set(-40, 10, 39.2);
        this.scene.add(hospitalCrossV);

        const hospitalCrossH = new THREE.Mesh(crossGeometry, crossMaterial);
        hospitalCrossH.rotation.z = Math.PI / 2;
        hospitalCrossH.position.set(-40, 10, 39.2);
        this.scene.add(hospitalCrossH);

        // Другие здания
        this.createCityBuildings();
    }

    createHospitalWindows(hospital) {
        const windowGeometry = new THREE.PlaneGeometry(1.5, 2);
        const windowMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.6,
            emissive: 0x002244
        });

        // Окна на фасаде
        for (let x = -6; x <= 6; x += 3) {
            for (let y = 2; y <= 10; y += 3) {
                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                window.position.set(-40 + x * 0.1, y, 39.1);
                this.scene.add(window);
            }
        }
    }

    createCityBuildings() {
        const buildingData = [
            { x: -20, z: 45, w: 8, h: 15, d: 6, color: 0x888888 },
            { x: 0, z: 45, w: 12, h: 20, d: 8, color: 0x999999 },
            { x: 25, z: 45, w: 6, h: 12, d: 6, color: 0x777777 },
            { x: 40, z: 40, w: 10, h: 18, d: 10, color: 0x666666 },
            { x: -35, z: -45, w: 7, h: 14, d: 7, color: 0x888888 },
            { x: -15, z: -40, w: 9, h: 16, d: 6, color: 0x777777 },
            { x: 10, z: -45, w: 11, h: 22, d: 8, color: 0x999999 },
            { x: 35, z: -45, w: 8, h: 13, d: 7, color: 0x666666 }
        ];

        buildingData.forEach(building => {
            const buildingGeometry = new THREE.BoxGeometry(building.w, building.h, building.d);
            const buildingMaterial = new THREE.MeshPhongMaterial({ 
                color: building.color,
                shininess: 20
            });
            const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
            buildingMesh.position.set(building.x, building.h / 2, building.z);
            buildingMesh.castShadow = true;
            buildingMesh.receiveShadow = true;
            this.scene.add(buildingMesh);

            // Простые окна для зданий
            this.createBuildingWindows(buildingMesh, building);
        });
    }

    createBuildingWindows(building, data) {
        const windowGeometry = new THREE.PlaneGeometry(0.8, 1.2);
        const windowMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4466aa,
            transparent: true,
            opacity: 0.7,
            emissive: 0x001122
        });

        const windowsX = Math.floor(data.w / 2);
        const windowsY = Math.floor(data.h / 3);

        for (let x = -windowsX; x <= windowsX; x += 2) {
            for (let y = 1; y <= windowsY * 2; y += 3) {
                if (Math.random() > 0.3) { // Не все окна светятся
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    window.position.set(
                        data.x + x,
                        y,
                        data.z + data.d / 2 + 0.01
                    );
                    this.scene.add(window);
                }
            }
        }
    }

    createVegetation() {
        // Деревья
        const treePositions = [
            { x: -25, z: 28 }, { x: -5, z: 28 }, { x: 15, z: 28 }, { x: 35, z: 28 },
            { x: -25, z: -28 }, { x: -5, z: -28 }, { x: 15, z: -28 }, { x: 35, z: -28 }
        ];

        treePositions.forEach(pos => {
            this.createTree(pos.x, pos.z);
        });

        // Кусты
        for (let i = 0; i < 15; i++) {
            const x = (Math.random() - 0.5) * 80;
            const z = (Math.random() - 0.5) * 80;
            if (Math.abs(z) > 25) { // Только на газонах
                this.createBush(x, z);
            }
        }
    }

    createTree(x, z) {
        // Ствол
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 6, 8);
        const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x4a3c28 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 3, z);
        trunk.castShadow = true;
        this.scene.add(trunk);

        // Крона
        const crownGeometry = new THREE.SphereGeometry(3, 12, 8);
        const crownMaterial = new THREE.MeshPhongMaterial({ color: 0x2a5a2a });
        const crown = new THREE.Mesh(crownGeometry, crownMaterial);
        crown.position.set(x, 7, z);
        crown.castShadow = true;
        crown.receiveShadow = true;
        this.scene.add(crown);
    }

    createBush(x, z) {
        const bushGeometry = new THREE.SphereGeometry(1, 8, 6);
        const bushMaterial = new THREE.MeshPhongMaterial({ color: 0x3a6a3a });
        const bush = new THREE.Mesh(bushGeometry, bushMaterial);
        bush.position.set(x, 0.8, z);
        bush.castShadow = true;
        bush.receiveShadow = true;
        this.scene.add(bush);
    }

    createHospitalBuilding() {
        // Уже создано в createBackgroundBuildings
    }

    createRoadAndTraffic() {
        // Дорожные знаки
        this.createRoadSigns();
        
        // Другие машины (простые модели)
        this.createTrafficCars();
    }

    createRoadSigns() {
        // Знак больницы
        const signPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
        const signPoleMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
        const signPole = new THREE.Mesh(signPoleGeometry, signPoleMaterial);
        signPole.position.set(15, 1.5, 18);
        signPole.castShadow = true;
        this.scene.add(signPole);

        const signGeometry = new THREE.PlaneGeometry(2, 1.5);
        const signMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            side: THREE.DoubleSide
        });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.set(15, 3.5, 18);
        this.scene.add(sign);

        // Крест на знаке
        const signCrossGeometry = new THREE.PlaneGeometry(0.8, 0.2);
        const signCrossMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        
        const signCrossH = new THREE.Mesh(signCrossGeometry, signCrossMaterial);
        signCrossH.position.set(15, 3.5, 18.01);
        this.scene.add(signCrossH);

        const signCrossV = new THREE.Mesh(signCrossGeometry, signCrossMaterial);
        signCrossV.rotation.z = Math.PI / 2;
        signCrossV.position.set(15, 3.5, 18.01);
        this.scene.add(signCrossV);
    }

    createTrafficCars() {
        const carPositions = [
            { x: -30, z: 5, color: 0x4444ff, rotation: 0 },
            { x: 25, z: -5, color: 0xff4444, rotation: Math.PI },
            { x: -15, z: 8, color: 0x44ff44, rotation: 0 }
        ];

        carPositions.forEach(carData => {
            this.createSimpleCar(carData.x, carData.z, carData.color, carData.rotation);
        });
    }

    createSimpleCar(x, z, color, rotation) {
        const carGroup = new THREE.Group();

        // Корпус
        const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 1.8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        body.castShadow = true;
        carGroup.add(body);

        // Кабина
        const cabinGeometry = new THREE.BoxGeometry(2, 1.2, 1.6);
        const cabinMaterial = new THREE.MeshPhongMaterial({ color: color });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(0.5, 2, 0);
        cabin.castShadow = true;
        carGroup.add(cabin);

        // Колеса
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 8);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        
        const wheelPositions = [
            { x: 1.5, z: 1 }, { x: 1.5, z: -1 },
            { x: -1.5, z: 1 }, { x: -1.5, z: -1 }
        ];

        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(pos.x, 0.4, pos.z);
            wheel.castShadow = true;
            carGroup.add(wheel);
        });

        carGroup.position.set(x, 0, z);
        carGroup.rotation.y = rotation;
        this.scene.add(carGroup);
    }

    createDetailedAmbulance() {
        console.log('🚑 Создаем ДЕТАЛИЗИРОВАННУЮ машину скорой помощи...');
        
        const ambulanceGroup = new THREE.Group();

        // ========== ОСНОВНОЙ КОРПУС ==========
        
        // Главная кабина (более реалистичные пропорции)
        const cabinGeometry = new THREE.BoxGeometry(3.5, 2.8, 2.2);
        const cabinMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            shininess: 100,
            specular: 0x333333
        });
        const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
        cabin.position.set(2.2, 1.8, 0);
        cabin.castShadow = true;
        cabin.receiveShadow = true;
        ambulanceGroup.add(cabin);

        // Медицинский отсек (задняя часть)
        const medicalBayGeometry = new THREE.BoxGeometry(4.5, 2.5, 2.2);
        const medicalBayMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            shininess: 100
        });
        const medicalBay = new THREE.Mesh(medicalBayGeometry, medicalBayMaterial);
        medicalBay.position.set(-1.2, 1.6, 0);
        medicalBay.castShadow = true;
        ambulanceGroup.add(medicalBay);

        // Крыша кабины (скошенная)
        const roofGeometry = new THREE.BoxGeometry(3.5, 0.3, 2.4);
        const roofMaterial = new THREE.MeshPhongMaterial({ color: 0xf0f0f0 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(2.2, 3.3, 0);
        roof.rotation.x = -0.1;
        ambulanceGroup.add(roof);

        // ========== ДЕТАЛИЗИРОВАННЫЕ КОЛЕСА ==========
        
        this.createDetailedWheels(ambulanceGroup);

        // ========== МЕДИЦИНСКИЕ СИМВОЛЫ ==========
        
        this.createMedicalSymbols(ambulanceGroup);

        // ========== ОСВЕЩЕНИЕ И СИГНАЛЫ ==========
        
        this.createEmergencyLighting(ambulanceGroup);

        // ========== ОКНА И ДВЕРИ ==========
        
        this.createWindowsAndDoors(ambulanceGroup);

        // ========== ВНЕШНИЕ ДЕТАЛИ ==========
        
        this.createExteriorDetails(ambulanceGroup);

        // ========== МЕДИЦИНСКОЕ ОБОРУДОВАНИЕ ==========
        
        this.createMedicalEquipment(ambulanceGroup);

        this.ambulance = ambulanceGroup;
        this.scene.add(ambulanceGroup);

        // Добавляем анимацию мигания
        this.animateAmbulance();
    }

    // Создание детализированных колес
    createDetailedWheels(ambulanceGroup) {
        const wheelPositions = [
            { x: 3.5, z: 1.3, name: 'frontRight' },
            { x: 3.5, z: -1.3, name: 'frontLeft' },
            { x: -2.5, z: 1.3, name: 'rearRight' },
            { x: -2.5, z: -1.3, name: 'rearLeft' }
        ];

        this.wheels = [];

        wheelPositions.forEach(pos => {
            const wheelGroup = new THREE.Group();

            // Шина
            const tireGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16);
            const tireMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x1a1a1a,
                roughness: 0.8
            });
            const tire = new THREE.Mesh(tireGeometry, tireMaterial);
            tire.rotation.z = Math.PI / 2;
            wheelGroup.add(tire);

            // Диск
            const rimGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.45, 8);
            const rimMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x888888,
                shininess: 200
            });
            const rim = new THREE.Mesh(rimGeometry, rimMaterial);
            rim.rotation.z = Math.PI / 2;
            wheelGroup.add(rim);

            // Центральная часть диска
            const hubGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.5, 8);
            const hubMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xcccccc,
                shininess: 300
            });
            const hub = new THREE.Mesh(hubGeometry, hubMaterial);
            hub.rotation.z = Math.PI / 2;
            wheelGroup.add(hub);

            // Болты на диске
            for (let i = 0; i < 5; i++) {
                const angle = (i / 5) * Math.PI * 2;
                const boltGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.1, 6);
                const boltMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
                const bolt = new THREE.Mesh(boltGeometry, boltMaterial);
                bolt.position.set(
                    Math.cos(angle) * 0.25,
                    Math.sin(angle) * 0.25,
                    0.25
                );
                bolt.rotation.z = Math.PI / 2;
                wheelGroup.add(bolt);
            }

            wheelGroup.position.set(pos.x, 0.6, pos.z);
            wheelGroup.castShadow = true;
            ambulanceGroup.add(wheelGroup);
            
            this.wheels.push(wheelGroup);
        });
    }

    // Создание медицинских символов
    createMedicalSymbols(ambulanceGroup) {
        // Красный крест на боках
        const crossSides = [
            { x: -1.2, y: 2, z: 1.15, rotation: { x: 0, y: 0, z: 0 } },
            { x: -1.2, y: 2, z: -1.15, rotation: { x: 0, y: Math.PI, z: 0 } }
        ];

        crossSides.forEach(side => {
            // Горизонтальная часть креста
            const crossHGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.02);
            const crossMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xff0000,
                emissive: 0x330000
            });
            const crossH = new THREE.Mesh(crossHGeometry, crossMaterial);
            crossH.position.set(side.x, side.y, side.z);
            crossH.rotation.set(side.rotation.x, side.rotation.y, side.rotation.z);
            ambulanceGroup.add(crossH);

            // Вертикальная часть креста
            const crossVGeometry = new THREE.BoxGeometry(0.3, 1.2, 0.02);
            const crossV = new THREE.Mesh(crossVGeometry, crossMaterial);
            crossV.position.set(side.x, side.y, side.z);
            crossV.rotation.set(side.rotation.x, side.rotation.y, side.rotation.z);
            ambulanceGroup.add(crossV);
        });

        // Надпись "AMBULANCE" на задней двери
        const textGeometry = new THREE.BoxGeometry(2.5, 0.4, 0.02);
        const textMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
        const ambulanceText = new THREE.Mesh(textGeometry, textMaterial);
        ambulanceText.position.set(-3.7, 2, 0);
        ambulanceGroup.add(ambulanceText);

        // Звезда жизни на крыше
        this.createStarOfLife(ambulanceGroup);
    }

    // Создание звезды жизни
    createStarOfLife(ambulanceGroup) {
        const starGroup = new THREE.Group();
        
        // Создаем шестиконечную звезду из треугольников
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            
            // Внешний треугольник
            const triangleGeometry = new THREE.ConeGeometry(0.15, 0.4, 3);
            const triangleMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x0066ff,
                emissive: 0x001133
            });
            const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
            triangle.position.set(
                Math.cos(angle) * 0.3,
                0,
                Math.sin(angle) * 0.3
            );
            triangle.rotation.y = angle + Math.PI / 2;
            triangle.rotation.x = Math.PI / 2;
            starGroup.add(triangle);
        }

        // Центральный круг
        const centerGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16);
        const centerMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            emissive: 0x111111
        });
        const center = new THREE.Mesh(centerGeometry, centerMaterial);
        center.rotation.x = Math.PI / 2;
        starGroup.add(center);

        starGroup.position.set(0, 3.8, 0);
        starGroup.rotation.x = Math.PI / 2;
        ambulanceGroup.add(starGroup);
    }

    // Создание аварийного освещения
    createEmergencyLighting(ambulanceGroup) {
        // Световая панель на крыше
        const lightBarGeometry = new THREE.BoxGeometry(3, 0.4, 0.8);
        const lightBarMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            shininess: 50
        });
        const lightBar = new THREE.Mesh(lightBarGeometry, lightBarMaterial);
        lightBar.position.set(0, 3.6, 0);
        ambulanceGroup.add(lightBar);

        // Синие мигалки
        this.blueLamps = [];
        const lampPositions = [
            { x: -1, y: 3.8, z: 0.3 },
            { x: 1, y: 3.8, z: 0.3 },
            { x: -1, y: 3.8, z: -0.3 },
            { x: 1, y: 3.8, z: -0.3 }
        ];

        lampPositions.forEach(pos => {
            const lampGeometry = new THREE.SphereGeometry(0.15, 12, 8);
            const lampMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x0066ff,
                emissive: 0x001133,
                transparent: true,
                opacity: 0.9
            });
            const lamp = new THREE.Mesh(lampGeometry, lampMaterial);
            lamp.position.set(pos.x, pos.y, pos.z);
            ambulanceGroup.add(lamp);
            this.blueLamps.push(lamp);
        });

        // Передние фары
        this.headlights = [];
        const headlightPositions = [
            { x: 4.2, y: 1.5, z: 0.8 },
            { x: 4.2, y: 1.5, z: -0.8 }
        ];

        headlightPositions.forEach(pos => {
            const headlightGeometry = new THREE.SphereGeometry(0.25, 12, 8);
            const headlightMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xffffaa,
                emissive: 0x333300,
                transparent: true,
                opacity: 0.95
            });
            const headlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
            headlight.position.set(pos.x, pos.y, pos.z);
            ambulanceGroup.add(headlight);
            this.headlights.push(headlight);
        });

        // Задние фонари
        const rearLightPositions = [
            { x: -3.8, y: 1.5, z: 0.8 },
            { x: -3.8, y: 1.5, z: -0.8 }
        ];

        rearLightPositions.forEach(pos => {
            const rearLightGeometry = new THREE.SphereGeometry(0.15, 12, 8);
            const rearLightMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xff0000,
                emissive: 0x330000
            });
            const rearLight = new THREE.Mesh(rearLightGeometry, rearLightMaterial);
            rearLight.position.set(pos.x, pos.y, pos.z);
            ambulanceGroup.add(rearLight);
        });
    }

    // Создание окон и дверей
    createWindowsAndDoors(ambulanceGroup) {
        // Лобовое стекло
        const windshieldGeometry = new THREE.PlaneGeometry(2.8, 1.8);
        const glassMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.3,
            shininess: 300
        });
        const windshield = new THREE.Mesh(windshieldGeometry, glassMaterial);
        windshield.position.set(3.8, 2.2, 0);
        windshield.rotation.y = Math.PI / 2;
        windshield.rotation.z = -0.1;
        ambulanceGroup.add(windshield);

        // Боковые окна кабины
        const sideWindowGeometry = new THREE.PlaneGeometry(1.5, 1.2);
        
        // Левое окно кабины
        const leftWindow = new THREE.Mesh(sideWindowGeometry, glassMaterial);
        leftWindow.position.set(2.2, 2.2, 1.15);
        ambulanceGroup.add(leftWindow);

        // Правое окно кабины
        const rightWindow = new THREE.Mesh(sideWindowGeometry, glassMaterial);
        rightWindow.position.set(2.2, 2.2, -1.15);
        ambulanceGroup.add(rightWindow);

        // Окна медицинского отсека
        const medWindowGeometry = new THREE.PlaneGeometry(1.8, 1);
        
        // Левое окно отсека
        const leftMedWindow = new THREE.Mesh(medWindowGeometry, glassMaterial);
        leftMedWindow.position.set(-1.2, 2.2, 1.15);
        ambulanceGroup.add(leftMedWindow);

        // Правое окно отсека
        const rightMedWindow = new THREE.Mesh(medWindowGeometry, glassMaterial);
        rightMedWindow.position.set(-1.2, 2.2, -1.15);
        ambulanceGroup.add(rightMedWindow);

        // Задние двери
        this.createRearDoors(ambulanceGroup);
    }

    // Создание задних дверей
    createRearDoors(ambulanceGroup) {
        const doorGeometry = new THREE.BoxGeometry(0.1, 2.3, 0.9);
        const doorMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

        // Левая дверь
        const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
        leftDoor.position.set(-3.6, 1.6, 0.6);
        ambulanceGroup.add(leftDoor);

        // Правая дверь
        const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
        rightDoor.position.set(-3.6, 1.6, -0.6);
        ambulanceGroup.add(rightDoor);

        // Ручки дверей
        const handleGeometry = new THREE.BoxGeometry(0.05, 0.1, 0.3);
        const handleMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });

        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.position.set(-3.55, 1.6, 0.3);
        ambulanceGroup.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightHandle.position.set(-3.55, 1.6, -0.3);
        ambulanceGroup.add(rightHandle);
    }

    // Создание внешних деталей
    createExteriorDetails(ambulanceGroup) {
        // Передний бампер
        const bumperGeometry = new THREE.BoxGeometry(0.3, 0.4, 2.4);
        const bumperMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const frontBumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
        frontBumper.position.set(4.3, 0.7, 0);
        ambulanceGroup.add(frontBumper);

        // Задний бампер
        const rearBumper = new THREE.Mesh(bumperGeometry, bumperMaterial);
        rearBumper.position.set(-3.9, 0.7, 0);
        ambulanceGroup.add(rearBumper);

        // Радиаторная решетка
        const grillGeometry = new THREE.BoxGeometry(0.05, 0.8, 1.8);
        const grillMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        const grill = new THREE.Mesh(grillGeometry, grillMaterial);
        grill.position.set(4.1, 1.8, 0);
        ambulanceGroup.add(grill);

        // Зеркала заднего вида
        const mirrorGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.15);
        const mirrorMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x444444,
            shininess: 200
        });

        const leftMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
        leftMirror.position.set(3.2, 2.8, 1.4);
        ambulanceGroup.add(leftMirror);

        const rightMirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
        rightMirror.position.set(3.2, 2.8, -1.4);
        ambulanceGroup.add(rightMirror);

        // Антенна
        const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
        const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.set(1, 4.5, 0.5);
        ambulanceGroup.add(antenna);

        // Выхлопная труба
        const exhaustGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8);
        const exhaustMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
        const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        exhaust.position.set(-3.8, 0.4, -1);
        exhaust.rotation.z = Math.PI / 2;
        ambulanceGroup.add(exhaust);
    }

    // Создание медицинского оборудования (видимого снаружи)
    createMedicalEquipment(ambulanceGroup) {
        // Кислородные баллоны (видны через заднее окно)
        const tankGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
        const tankMaterial = new THREE.MeshPhongMaterial({ color: 0x00aa00 });

        for (let i = 0; i < 2; i++) {
            const tank = new THREE.Mesh(tankGeometry, tankMaterial);
            tank.position.set(-2.5, 1.2, -0.4 + i * 0.8);
            tank.rotation.z = Math.PI / 2;
            ambulanceGroup.add(tank);
        }

        // Каталка (частично видна)
        const stretcherGeometry = new THREE.BoxGeometry(0.3, 0.1, 1.8);
        const stretcherMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
        const stretcher = new THREE.Mesh(stretcherGeometry, stretcherMaterial);
        stretcher.position.set(-1.5, 0.9, 0);
        ambulanceGroup.add(stretcher);

        // Медицинский ящик на внешней стороне
        const medBoxGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.15);
        const medBoxMaterial = new THREE.MeshPhongMaterial({ color: 0xff6666 });
        const medBox = new THREE.Mesh(medBoxGeometry, medBoxMaterial);
        medBox.position.set(-0.5, 1.2, -1.15);
        ambulanceGroup.add(medBox);

        // Крест на медицинском ящике
        const smallCrossGeometry = new THREE.BoxGeometry(0.3, 0.08, 0.01);
        const smallCrossMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        
        const smallCrossH = new THREE.Mesh(smallCrossGeometry, smallCrossMaterial);
        smallCrossH.position.set(-0.5, 1.2, -1.14);
        ambulanceGroup.add(smallCrossH);

        const smallCrossV = new THREE.Mesh(smallCrossGeometry, smallCrossMaterial);
        smallCrossV.position.set(-0.5, 1.2, -1.14);
        smallCrossV.rotation.z = Math.PI / 2;
        ambulanceGroup.add(smallCrossV);
    }

    createAtmosphere() {
        // Улучшенные дождевые частицы
        this.createAdvancedRain();
        
        // Туман и облака
        this.createFogEffects();
        
        // Световые блики на мокром асфальте
        this.createWetAsphaltReflections();
    }

    createAdvancedRain() {
        const rainGeometry = new THREE.BufferGeometry();
        const rainMaterial = new THREE.PointsMaterial({
            color: 0x9999ff,
            size: 0.15,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });

        const rainVertices = [];
        const rainVelocities = [];
        
        for (let i = 0; i < 2000; i++) {
            rainVertices.push(
                Math.random() * 200 - 100,  // x
                Math.random() * 80,         // y
                Math.random() * 200 - 100   // z
            );
            rainVelocities.push(
                Math.random() * 0.1 - 0.05, // vx
                -Math.random() * 0.8 - 0.5,  // vy
                Math.random() * 0.1 - 0.05   // vz
            );
        }

        rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rainVertices, 3));
        this.rain = new THREE.Points(rainGeometry, rainMaterial);
        this.rainVelocities = rainVelocities;
        this.scene.add(this.rain);
    }

    createFogEffects() {
        // Создаем объемный туман с помощью плоскостей
        for (let i = 0; i < 5; i++) {
            const fogGeometry = new THREE.PlaneGeometry(50, 20);
            const fogMaterial = new THREE.MeshBasicMaterial({
                color: 0x666699,
                transparent: true,
                opacity: 0.1,
                side: THREE.DoubleSide
            });
            const fogPlane = new THREE.Mesh(fogGeometry, fogMaterial);
            fogPlane.position.set(
                Math.random() * 100 - 50,
                5 + Math.random() * 10,
                Math.random() * 100 - 50
            );
            fogPlane.rotation.y = Math.random() * Math.PI;
            this.scene.add(fogPlane);
        }
    }

    createWetAsphaltReflections() {
        // Лужи на дороге
        for (let i = 0; i < 10; i++) {
            const puddleGeometry = new THREE.CircleGeometry(Math.random() * 3 + 1, 16);
            const puddleMaterial = new THREE.MeshPhongMaterial({
                color: 0x333366,
                transparent: true,
                opacity: 0.6,
                shininess: 300,
                reflectivity: 0.8
            });
            const puddle = new THREE.Mesh(puddleGeometry, puddleMaterial);
            puddle.rotation.x = -Math.PI / 2;
            puddle.position.set(
                (Math.random() - 0.5) * 60,
                0.01,
                (Math.random() - 0.5) * 25
            );
            this.scene.add(puddle);
        }
    }

    createReflections() {
        // Добавляем отражения от световых источников
        // Это создаст более реалистичную картину в ночное время
    }

    // Анимация машины скорой помощи
    animateAmbulance() {
        if (!this.ambulance) return;

        // Анимация мигающих огней
        if (this.blueLamps) {
            const time = Date.now() * 0.005;
            this.blueLamps.forEach((lamp, index) => {
                const intensity = Math.sin(time + index * Math.PI) * 0.5 + 0.5;
                lamp.material.emissive.setHex(intensity > 0.5 ? 0x0044bb : 0x001133);
            });
        }

        // Легкое покачивание (работающий двигатель)
        this.ambulance.rotation.z = Math.sin(Date.now() * 0.004) * 0.003;
        this.ambulance.position.y = Math.sin(Date.now() * 0.006) * 0.02;

        // Вращение колес при движении
        if (this.wheels) {
            this.wheels.forEach(wheel => {
                wheel.rotation.x += 0.02;
            });
        }

        // Мерцание фар
        if (this.headlights) {
            const flickerIntensity = 0.8 + Math.sin(Date.now() * 0.02) * 0.1;
            this.headlights.forEach(light => {
                light.material.emissive.setScalar(flickerIntensity * 0.3);
            });
        }

        requestAnimationFrame(() => this.animateAmbulance());
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.016; // ~60fps

        // Анимация мигающих огней скорой помощи
        this.animateEmergencyLights();
        
        // Анимация дождя
        this.animateAdvancedRain();
        
        // Анимация движения камеры
        this.animateCamera();

        this.renderer.render(this.scene, this.camera);
    }

    animateEmergencyLights() {
        // Попеременное мигание синих огней
        const frequency = this.time * 8;
        const flash1 = Math.sin(frequency) > 0 ? 1 : 0;
        const flash2 = Math.sin(frequency + Math.PI) > 0 ? 1 : 0;

        // Синие огни
        if (this.blueLight1 && this.blueLight2) {
            this.blueLight1.intensity = flash1 * 3;
            this.blueLight2.intensity = flash2 * 3;
        }

        // Обновляем материалы ламп
        if (this.blueLamps) {
            this.blueLamps.forEach((lamp, index) => {
                const flash = index % 2 === 0 ? flash1 : flash2;
                lamp.material.emissive.setHex(flash ? 0x0044bb : 0x001133);
            });
        }

        // Мерцание фар
        const headlightFlicker = 0.9 + Math.sin(this.time * 25) * 0.1;
        if (this.headLight1 && this.headLight2) {
            this.headLight1.intensity = headlightFlicker;
            this.headLight2.intensity = headlightFlicker;
        }

        if (this.headlights) {
            this.headlights.forEach(light => {
                light.material.emissive.setScalar(headlightFlicker * 0.3);
            });
        }
    }

    animateAdvancedRain() {
        if (this.rain && this.rainVelocities) {
            const positions = this.rain.geometry.attributes.position.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const velocityIndex = Math.floor(i / 3);
                
                // Обновляем позицию
                positions[i] += this.rainVelocities[velocityIndex * 3];     // x
                positions[i + 1] += this.rainVelocities[velocityIndex * 3 + 1]; // y
                positions[i + 2] += this.rainVelocities[velocityIndex * 3 + 2]; // z
                
                // Сброс дождевых капель
                if (positions[i + 1] < 0) {
                    positions[i] = Math.random() * 200 - 100;
                    positions[i + 1] = 80;
                    positions[i + 2] = Math.random() * 200 - 100;
                }
                
                // Границы по x и z
                if (positions[i] < -100 || positions[i] > 100) {
                    positions[i] = Math.random() * 200 - 100;
                }
                if (positions[i + 2] < -100 || positions[i + 2] > 100) {
                    positions[i + 2] = Math.random() * 200 - 100;
                }
            }
            
            this.rain.geometry.attributes.position.needsUpdate = true;
        }
    }

    animateCamera() {
        // Плавное движение камеры за мышью
        const targetX = this.mouse.x * 8;
        const targetY = this.mouse.y * 5 + 12;
        
        this.camera.position.x += (20 + targetX - this.camera.position.x) * 0.03;
        this.camera.position.y += (targetY - this.camera.position.y) * 0.03;
        
        // Легкое покачивание камеры
        const sway = Math.sin(this.time * 0.5) * 0.1;
        this.camera.position.z += sway;
        
        this.camera.lookAt(0, 2, 0);
    }
}

// Запуск улучшенной 3D сцены
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚑 Инициализация МАКСИМАЛЬНО реалистичной медицинской сцены...');
    
    setTimeout(() => {
        if (typeof THREE !== 'undefined') {
            window.medical3DScene = new Medical3DScene();
            console.log('✅ ДЕТАЛИЗИРОВАННАЯ 3D сцена создана с:');
            console.log('🏥 Больничное здание');
            console.log('🚗 Детализированная скорая помощь');
            console.log('🌧️ Реалистичный дождь');
            console.log('🌃 Городское окружение');
            console.log('💡 Динамическое освещение');
            console.log('🚦 Дорожная инфраструктура');
        } else {
            console.error('❌ Three.js не загружен');
        }
    }, 500);
});
