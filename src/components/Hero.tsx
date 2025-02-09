import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Sphere, Points, Float, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect, Suspense, useMemo } from 'react'
import * as THREE from 'three'
import FeaturedProjects from './FeaturedProjects'
import { useApp } from '../contexts/AppContext'

// Meteor kuşağı komponenti
const AsteroidBelt = ({ radius, scale = 1 }: { radius: number; scale?: number }) => {
  const { theme } = useApp();
  const asteroidCount = 3000;
  const beltWidth = 1 * scale;
  
  const asteroids = useMemo(() => {
    const temp = [];
    for (let i = 0; i < asteroidCount; i++) {
      const angle = (i / asteroidCount) * Math.PI * 2;
      const radiusVariation = radius + (Math.random() - 0.5) * beltWidth;
      
      // Yatay düzlemde daha düzgün dağılım
      const x = Math.cos(angle) * radiusVariation;
      const z = Math.sin(angle) * radiusVariation;
      
      temp.push(x, 0, z);
    }
    return new Float32Array(temp);
  }, [radius, beltWidth]);

  const asteroidRef = useRef<THREE.Group>();

  useFrame((state) => {
    if (asteroidRef.current) {
      asteroidRef.current.rotation.y += 0.0002;
    }
  });

  // Güneşe olan uzaklığa göre parlaklık hesaplama
  const opacity = Math.max(0.4, 1 - radius / 25); // 25 birim maksimum mesafe
  const particleSize = Math.max(0.04, 0.08 - (radius / 25) * 0.04);

  return (
    <group ref={asteroidRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={asteroidCount}
            array={asteroids}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={particleSize * scale}
          color={theme === 'dark' ? 0xFFFFFF : 0x000000}
          sizeAttenuation
          transparent
          opacity={opacity}
        />
      </points>
    </group>
  );
};

// Güneş komponenti
const Sun = () => {
  const sunRef = useRef<THREE.Mesh>();
  const coronaRef = useRef<THREE.Mesh>();
  const time = useRef(0);
  
  useFrame((state, delta) => {
    time.current += delta;
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= 0.001;
      coronaRef.current.rotation.z += 0.001;
      coronaRef.current.scale.x = 1.2 + Math.sin(time.current) * 0.05;
      coronaRef.current.scale.y = 1.2 + Math.cos(time.current * 0.8) * 0.05;
      coronaRef.current.scale.z = 1.2 + Math.sin(time.current * 1.2) * 0.05;
    }
  });

  return (
    <group position={[15, 0, 0]}>
      {/* Güneş çekirdeği */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial color="#FDB813" />
        <pointLight intensity={2} distance={100} decay={2} />
      </mesh>

      {/* Güneş koronası */}
      <mesh ref={coronaRef}>
        <sphereGeometry args={[6, 64, 64]} />
        <meshBasicMaterial
          color="#FDB813"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
        <pointLight intensity={1} distance={50} decay={1} color="#FFFFFF" />
      </mesh>

      {/* Güneş parlaması */}
      <sprite scale={[15, 15, 1]}>
        <spriteMaterial
          map={new THREE.TextureLoader().load('/sun-flare.png')}
          color="#FFA500"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
};

// Gezegen Materyalleri
const PlanetMaterials = {
  Mercury: <meshPhongMaterial
    color="#8C8C8C"
    emissive="#1a1a1a"
    specular="#4d4d4d"
    shininess={5}
  />,
  Venus: <meshPhongMaterial
    color="#E6B267"
    emissive="#994d00"
    specular="#ffcc99"
    shininess={10}
    opacity={0.9}
    transparent
  />,
  Earth: <meshPhongMaterial
    color="#4B6CB7"
    emissive="#000033"
    specular="#ffffff"
    shininess={15}
    opacity={0.95}
    transparent
  />,
  Mars: <meshPhongMaterial
    color="#CF4520"
    emissive="#661a00"
    specular="#ff6666"
    shininess={5}
  />,
  Jupiter: <meshPhongMaterial
    color="#C88B3A"
    emissive="#663300"
    specular="#ffd699"
    shininess={20}
    opacity={0.95}
    transparent
  />,
  Saturn: <meshPhongMaterial
    color="#E6B87C"
    emissive="#804d00"
    specular="#ffd699"
    shininess={15}
    opacity={0.9}
    transparent
  />,
  Uranus: <meshPhongMaterial
    color="#73B9C6"
    emissive="#004d4d"
    specular="#99ffff"
    shininess={25}
    opacity={0.8}
    transparent
  />,
  Neptune: <meshPhongMaterial
    color="#3F54BA"
    emissive="#000066"
    specular="#9999ff"
    shininess={30}
    opacity={0.85}
    transparent
  />
};

interface PlanetProps {
  position: [number, number, number];
  size: number;
  rotationSpeed: number;
  isSaturn?: boolean;
  planetType: keyof typeof PlanetMaterials;
}

const Planet = ({ position, size, rotationSpeed, isSaturn = false, planetType }: PlanetProps) => {
  const planetRef = useRef<THREE.Mesh>();
  const ringRef = useRef<THREE.Mesh>();
  const atmosphereRef = useRef<THREE.Mesh>();

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * rotationSpeed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * rotationSpeed * 0.5;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * rotationSpeed * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Atmosfer */}
      <mesh ref={atmosphereRef} scale={[1.05, 1.05, 1.05]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshPhongMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Gezegen */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 32, 32]} />
        {PlanetMaterials[planetType]}
      </mesh>

      {/* Satürn Halkası */}
      {isSaturn && (
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[size * 1.4, size * 2, 64]} />
          <meshPhongMaterial
            color="#E6B87C"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            specular="#ffd699"
            shininess={10}
          />
        </mesh>
      )}
    </group>
  );
};

interface CometProps {
  startPosition: [number, number, number];
  direction: [number, number, number];
  speed: number;
}

// Kuyruklu Yıldız komponenti
const Comet = ({ startPosition, direction, speed }: CometProps) => {
  const { theme } = useApp();
  const cometRef = useRef<THREE.Group>();
  const [positions, setPositions] = useState(() => {
    const trail = [];
    for (let i = 0; i < 20; i++) {
      trail.push(
        startPosition[0] - direction[0] * i * 0.5,
        startPosition[1] - direction[1] * i * 0.5,
        startPosition[2] - direction[2] * i * 0.5
      );
    }
    return new Float32Array(trail);
  });

  useFrame((state) => {
    if (cometRef.current) {
      cometRef.current.position.x += direction[0] * speed * 0.1;
      cometRef.current.position.y += direction[1] * speed * 0.1;
      cometRef.current.position.z += direction[2] * speed * 0.1;

      // Ekranın dışına çıkınca başa al
      if (Math.abs(cometRef.current.position.x) > 100 || 
          Math.abs(cometRef.current.position.y) > 100 || 
          Math.abs(cometRef.current.position.z) > 100) {
        cometRef.current.position.set(startPosition[0], startPosition[1], startPosition[2]);
      }

      // Kuyruk pozisyonlarını güncelle
      const newPositions = new Float32Array(positions.length);
      for (let i = 0; i < positions.length; i += 3) {
        newPositions[i] = cometRef.current.position.x - direction[0] * (i/3) * 0.5;
        newPositions[i+1] = cometRef.current.position.y - direction[1] * (i/3) * 0.5;
        newPositions[i+2] = cometRef.current.position.z - direction[2] * (i/3) * 0.5;
      }
      setPositions(newPositions);
    }
  });

  return (
    <group ref={cometRef} position={startPosition}>
      {/* Kuyruklu yıldızın başı */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color={theme === 'dark' ? "#FFFFFF" : "#000000"} />
      </mesh>
      {/* Kuyruk */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={20}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          color={theme === 'dark' ? "#FFFFFF" : "#000000"}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      {/* Işık huzmesi */}
      <pointLight color={theme === 'dark' ? "#FFFFFF" : "#000000"} intensity={0.5} distance={5} decay={2} />
    </group>
  );
};

// Özel Yıldızlar komponenti
const CustomStars = () => {
  const { theme } = useApp();
  const starsCount = 8000;
  
  const [positions] = useState(() => {
    const positions = [];
    for (let i = 0; i < starsCount; i++) {
      const r = 100; // yarıçap
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions.push(x, y, z);
    }
    return new Float32Array(positions);
  });

  const pointsRef = useRef<THREE.Points>();

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starsCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={theme === 'dark' ? "#FFFFFF" : "#000000"}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
};

const SpaceScene = ({ cameraPosition }: { cameraPosition: number }) => {
  const { theme } = useApp();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  
  // Rastgele kuyruklu yıldız başlangıç pozisyonları ve yönleri
  const comets = useMemo(() => {
    const cometData = [];
    for (let i = 0; i < 5; i++) {
      const startPos = [
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
      ];
      const dir = [
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ];
      // Yönü normalize et
      const length = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1] + dir[2] * dir[2]);
      dir[0] /= length;
      dir[1] /= length;
      dir[2] /= length;
      
      cometData.push({
        startPosition: startPos as [number, number, number],
        direction: dir as [number, number, number],
        speed: Math.random() * 0.5 + 0.5
      });
    }
    return cometData;
  }, []);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = 45 + cameraPosition;
    }
  }, [cameraPosition]);

  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      <Suspense fallback={null}>
        <PerspectiveCamera
          ref={cameraRef}
          makeDefault
          position={[0, 30, 45]}
          fov={50}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
        
        <ambientLight intensity={0.2} />
        <directionalLight position={[15, 0, 0]} intensity={2} />
        
        {/* Güneş */}
        <Sun />

        {/* Gezegenler - Sağ Üst */}
        <Planet position={[25, 8, -10]} size={1.2} rotationSpeed={1.5} planetType="Mercury" /> {/* Merkür */}
        <Planet position={[35, 10, -15]} size={1.8} rotationSpeed={1.2} planetType="Venus" /> {/* Venüs */}

        {/* Gezegenler - Sağ Alt */}
        <Planet position={[30, -8, -20]} size={2} rotationSpeed={1} planetType="Earth" /> {/* Dünya */}
        <Planet position={[40, -10, -25]} size={1.6} rotationSpeed={0.8} planetType="Mars" /> {/* Mars */}

        {/* Gezegenler - Sol Üst */}
        <Planet position={[-25, 8, -12]} size={4} rotationSpeed={0.6} planetType="Jupiter" /> {/* Jüpiter */}
        <Planet position={[-35, 10, -18]} size={3.5} rotationSpeed={0.4} isSaturn={true} planetType="Saturn" /> {/* Satürn */}

        {/* Gezegenler - Sol Alt */}
        <Planet position={[-30, -8, -22]} size={2.8} rotationSpeed={0.3} planetType="Uranus" /> {/* Uranüs */}
        <Planet position={[-40, -10, -28]} size={2.6} rotationSpeed={0.2} planetType="Neptune" /> {/* Neptün */}

        {/* Yatay Meteor Kuşakları - Güneşin etrafında */}
        <group position={[15, 0, 0]}>
          <AsteroidBelt radius={8} scale={1.2} /> {/* İç kuşak - En parlak */}
          <AsteroidBelt radius={13} scale={1} /> {/* Orta kuşak */}
          <AsteroidBelt radius={18} scale={0.8} /> {/* Dış kuşak - En az parlak */}
        </group>

        {/* Kuyruklu Yıldızlar */}
        {comets.map((comet, index) => (
          <Comet
            key={index}
            startPosition={comet.startPosition}
            direction={comet.direction}
            speed={comet.speed}
          />
        ))}

        {/* Özel Yıldızlar */}
        <CustomStars />
      </Suspense>
    </Canvas>
  );
};

const Hero = () => {
  const { theme } = useApp();
  const [cameraPosition, setCameraPosition] = useState(0);

  const handleScroll = (direction: 'forward' | 'backward') => {
    setCameraPosition(prev => {
      const newPos = direction === 'forward' ? prev - 5 : prev + 5;
      return Math.max(-20, Math.min(20, newPos));
    });
  };
  
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0">
          <SpaceScene cameraPosition={cameraPosition} />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 opacity-60">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "40%" }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "20%" }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className={`h-2 ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400'} rounded-full`}
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "5%" }}
                  transition={{ duration: 0.2, delay: 0.6 }}
                  className={`h-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-500'} rounded-full`}
                />
              </div>
              
              <div className="flex flex-wrap gap-2 opacity-60">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "25%" }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "8%" }}
                  transition={{ duration: 0.2, delay: 0.5 }}
                  className={`h-2 ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400'} rounded-full`}
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "15%" }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  className="h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "35%" }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  className="h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full"
                />
              </div>

              <div className="flex flex-wrap gap-2 opacity-60">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "15%" }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "8%" }}
                  transition={{ duration: 0.2, delay: 0.6 }}
                  className={`h-2 ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400'} rounded-full`}
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "25%" }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                />
              </div>

              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none mt-8 transition-colors
                ${theme === 'dark' ? 'text-dark-text' : 'text-light-text'}`}>
                Ahmet Can Bozkurt
              </h1>
              <h2 className={`text-xl md:text-2xl transition-colors
                ${theme === 'dark' ? 'text-dark-text/80' : 'text-light-text/80'}`}>
                Full Stack Developer 
              </h2>

              <div className="flex flex-wrap gap-2 opacity-60 mt-8">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "25%" }}
                  transition={{ duration: 0.4, delay: 1 }}
                  className="h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "35%" }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                />
              </div>

              <div className="flex flex-wrap gap-2 opacity-60">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "35%" }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  className="h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "15%" }}
                  transition={{ duration: 0.3, delay: 1.3 }}
                  className="h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                />
              </div>

              <div className="flex flex-wrap gap-2 opacity-60">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "10%" }}
                  transition={{ duration: 0.2, delay: 1.2 }}
                  className={`h-2 ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-400'} rounded-full`}
                />
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "25%" }}
                  transition={{ duration: 0.4, delay: 1.4 }}
                  className="h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                />
              </div>
            </div>
            <p className={`text-sm md:text-base max-w-xl transition-colors p-4 rounded-lg border backdrop-blur-sm leading-relaxed
              ${theme === 'dark' 
                ? 'text-dark-text/80 border-dark-border/30 bg-dark-surface/30' 
                : 'text-light-text/80 border-light-border/30 bg-light-surface/30'}`}>
    Web geliştirme alanında kendimi sürekli geliştirerek, başarılı projeler ortaya çıkarmayı hedefliyorum.
Bu doğrultuda HTML, CSS, JavaScript, ReactJS, AngularJS, ASP.NET Core ve C# teknolojileri üzerinde çalışıyor ve yetkinliklerimi artırıyorum.

Çalıştığım şirkette işime sadece bir görev olarak bakmıyor, sahiplenerek ve değer katarak ilerlemekten büyük keyif alıyorum.
Amacım, yenilikçi ve etkili çözümler geliştirerek sektörde fark yaratmak ve teknolojiyi en iyi şekilde kullanmak. 🚀
            </p>
            <div className="pt-4 relative flex flex-col items-center gap-2">
              <a
                href="#contact"
                className={`link-hover text-lg tracking-wider transition-colors
                  ${theme === 'dark' ? 'text-dark-text hover:text-primary' : 'text-light-text hover:text-primary'}`}
              >
                İLETİŞİME GEÇ
              </a>
              <div className="flex items-center justify-center gap-20 mt-4">
                <motion.button
                  onClick={() => handleScroll('backward')}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    repeatType: "reverse"
                  }}
                  className="text-5xl text-red-500 font-bold cursor-pointer"
                >
                  ←
                </motion.button>
                <motion.button
                  onClick={() => handleScroll('forward')}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    repeatType: "reverse"
                  }}
                  className="text-5xl text-red-500 font-bold cursor-pointer"
                >
                  →
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    
    </>
  )
}

export default Hero 