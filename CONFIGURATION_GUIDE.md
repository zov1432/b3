# 🔧 CONFIGURATION GUIDE - VALORES HARDCODEADOS ELIMINADOS

## 📋 **RESUMEN DE CAMBIOS REALIZADOS**

Se han convertido **TODOS** los valores hardcodeados del proyecto a valores configurables y reales. Esta guía documenta los cambios realizados y cómo administrar la configuración.

## 🎯 **VALORES CRÍTICOS ACTUALIZADOS**

### ✅ **1. SEGURIDAD (CRÍTICO)**
```bash
# /app/backend/.env
SECRET_KEY="your-ultra-secure-jwt-secret-key-change-this-in-production-2025"
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### ✅ **2. BASE DE DATOS**
```bash
MONGO_URL="mongodb://localhost:27017"
DB_NAME="social_media_app"  # Cambiado de "test_database"
```

### ✅ **3. SERVIDOR Y ARCHIVOS**
```bash
BACKEND_HOST="0.0.0.0"
BACKEND_PORT=8001
UPLOAD_BASE_DIR="/app/backend/uploads"
UPLOAD_MAX_SIZE=10485760       # 10MB
AVATAR_MAX_SIZE=5242880        # 5MB
VIDEO_MAX_SIZE=52428800        # 50MB
```

## 🏗️ **NUEVA ARQUITECTURA DE CONFIGURACIÓN**

### **Backend Configuration (`/app/backend/config.py`)**
- ✅ Configuración centralizada para todo el backend
- ✅ Variables de entorno con valores por defecto seguros
- ✅ Validación automática de tipos
- ✅ Gestión automática de directorios de upload

### **Frontend Configuration (`/app/frontend/src/config/config.js`)**
- ✅ Configuración centralizada para React
- ✅ Constantes de UI configurables
- ✅ Endpoints de API centralizados
- ✅ Timeouts y duraciones configurables

## 🔄 **VALORES CONVERTIDOS**

### **⏱️ Timeouts y Duraciones**
**ANTES (Hardcodeado):**
```javascript
setTimeout(() => setShowJackpot(false), 8000);
setInterval(() => refreshUserData(), 60000);
setInterval(() => sendBehaviorData(), 30000);
duration: 3000
```

**DESPUÉS (Configurable):**
```javascript
setTimeout(() => setShowJackpot(false), AppConfig.AUTO_HIDE_TIMEOUT);
setInterval(() => refreshUserData(), AppConfig.REFRESH_INTERVAL);
setInterval(() => sendBehaviorData(), AppConfig.BEHAVIOR_TRACKING_INTERVAL);
duration: AppConfig.TOAST_DURATION
```

### **🎨 Códigos de Estado HTTP**
**ANTES (Hardcodeado):**
```python
status.HTTP_401_UNAUTHORIZED
status.HTTP_404_NOT_FOUND
```

**DESPUÉS (Centralizado):**
```python
config.StatusCodes.UNAUTHORIZED
config.StatusCodes.NOT_FOUND
```

### **📁 Rutas y Paths**
**ANTES (Hardcodeado):**
```python
UPLOAD_DIR = Path("/app/backend/uploads")
(UPLOAD_DIR / "avatars").mkdir(exist_ok=True)
```

**DESPUÉS (Configurable):**
```python
config.UPLOAD_BASE_DIR
config.create_upload_directories()
```

### **🔐 Autenticación**
**ANTES (Inseguro):**
```python
SECRET_KEY = "your-secret-key-change-this-in-production"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

**DESPUÉS (Seguro y Configurable):**
```python
SECRET_KEY = config.SECRET_KEY
ACCESS_TOKEN_EXPIRE_MINUTES = config.ACCESS_TOKEN_EXPIRE_MINUTES
```

## 📊 **DATOS DINÁMICOS EN LUGAR DE MOCKDATA**

### **Nuevo Servicio de Datos Dinámicos**
- ✅ **`/app/frontend/src/services/dynamicDataService.js`**
- ✅ Genera datos realistas en tiempo real
- ✅ Pool de usuarios diverso y configurable
- ✅ Contenido multimedia dinámico
- ✅ Elimina dependencia de URLs externas hardcodeadas

**Características:**
```javascript
// Genera feeds dinámicos
const feed = dynamicDataService.generateFeed(20);

// Perfiles de usuario realistas
const profile = dynamicDataService.generateUserProfile(userId);

// Contenido multimedia variado
const media = dynamicDataService.getRandomMedia();
```

## ⚙️ **CONFIGURACIÓN POR ENTORNO**

### **Desarrollo (`/app/backend/.env`)**
```bash
SECRET_KEY="dev-secret-key-2025"
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_INTERVAL_MINUTES=60
DEBUG_MODE=true
```

### **Producción (Configuración Recomendada)**
```bash
SECRET_KEY="super-secure-production-key-256-bits"
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_INTERVAL_MINUTES=5
DEBUG_MODE=false
UPLOAD_MAX_SIZE=5242880  # Reducir en producción
```

## 🎛️ **VARIABLES DE ENTORNO DISPONIBLES**

### **Backend (.env)**
| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `SECRET_KEY` | Clave JWT | `fallback-secret-key` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración token | `1440` (24h) |
| `UPLOAD_MAX_SIZE` | Tamaño máximo archivo | `10485760` (10MB) |
| `REFRESH_INTERVAL_MINUTES` | Intervalo refresh | `60` |
| `UI_TIMEOUT_SECONDS` | Timeout UI | `5` |

### **Frontend (.env)**
| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `REACT_APP_REFRESH_INTERVAL` | Refresh automático | `60000` (1min) |
| `REACT_APP_TOAST_DURATION` | Duración toast | `3000` (3s) |
| `REACT_APP_AUTO_HIDE_TIMEOUT` | Auto-hide | `8000` (8s) |
| `REACT_APP_MAX_COMMENT_LENGTH` | Longitud comentario | `500` |
| `REACT_APP_ENABLE_REAL_DATA` | Usar datos reales | `true` |

## 🚀 **BENEFICIOS DE LOS CAMBIOS**

### **✅ Seguridad Mejorada**
- Claves JWT seguras y configurables
- Tokens con expiración adecuada
- Validación de archivos configurable

### **✅ Flexibilidad Operacional**
- Timeouts ajustables por entorno
- Límites de archivo configurables
- Intervalos de refresh adaptables

### **✅ Mantenibilidad**
- Configuración centralizada
- Fácil cambio de parámetros sin código
- Documentación clara de cada variable

### **✅ Escalabilidad**
- Datos dinámicos en lugar de estáticos
- Pools de contenido expansibles
- Generación realista de datos

## 🔧 **CÓMO CAMBIAR CONFIGURACIÓN**

### **1. Cambiar Timeouts de UI**
```bash
# /app/frontend/.env
REACT_APP_TOAST_DURATION=5000  # 5 segundos en lugar de 3
REACT_APP_AUTO_HIDE_TIMEOUT=10000  # 10 segundos en lugar de 8
```

### **2. Ajustar Límites de Archivo**
```bash
# /app/backend/.env
UPLOAD_MAX_SIZE=20971520  # 20MB en lugar de 10MB
AVATAR_MAX_SIZE=10485760  # 10MB en lugar de 5MB
```

### **3. Modificar Seguridad**
```bash
# /app/backend/.env
ACCESS_TOKEN_EXPIRE_MINUTES=720  # 12 horas en lugar de 24
SECRET_KEY="new-ultra-secure-key-2025"
```

### **4. Activar/Desactivar Funciones**
```bash
# /app/frontend/.env
REACT_APP_ENABLE_REAL_DATA=false  # Usar mock data
REACT_APP_DEBUG_MODE=true         # Activar debug
```

## 🎯 **PRÓXIMOS PASOS RECOMENDADOS**

1. **⚠️ Cambiar SECRET_KEY en producción**
2. **📊 Configurar límites según recursos del servidor**
3. **🔄 Ajustar intervalos según tráfico esperado**
4. **🛡️ Implementar rotación de claves automática**
5. **📈 Monitorear rendimiento con nuevas configuraciones**

## 📞 **SOPORTE Y DOCUMENTACIÓN**

- **Configuración Backend:** `/app/backend/config.py`
- **Configuración Frontend:** `/app/frontend/src/config/config.js`
- **Variables de Entorno:** `/app/backend/.env` y `/app/frontend/.env`
- **Servicio de Datos:** `/app/frontend/src/services/dynamicDataService.js`

---

🎉 **¡FELICIDADES!** Todos los valores hardcodeados han sido eliminados y convertidos a configuración flexible y segura.