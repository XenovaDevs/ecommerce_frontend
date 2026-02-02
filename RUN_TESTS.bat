@echo off
echo ========================================
echo   Tests E2E - Le Pas Sage Ecommerce
echo ========================================
echo.

:menu
echo Selecciona una opcion:
echo.
echo 1. Correr TODOS los tests
echo 2. Tests de Home
echo 3. Tests de Productos
echo 4. Tests de Carrito
echo 5. Tests de Checkout (Invitado)
echo 6. Tests de Autenticacion
echo 7. Modo UI (Interactivo)
echo 8. Ver ultimo reporte
echo 9. Salir
echo.

set /p choice="Opcion (1-9): "

if "%choice%"=="1" (
    echo.
    echo Corriendo todos los tests...
    call npm test
    goto end
)

if "%choice%"=="2" (
    echo.
    echo Corriendo tests de Home...
    call npm run test:home
    goto end
)

if "%choice%"=="3" (
    echo.
    echo Corriendo tests de Productos...
    call npm run test:products
    goto end
)

if "%choice%"=="4" (
    echo.
    echo Corriendo tests de Carrito...
    call npm run test:cart
    goto end
)

if "%choice%"=="5" (
    echo.
    echo Corriendo tests de Checkout...
    call npm run test:checkout
    goto end
)

if "%choice%"=="6" (
    echo.
    echo Corriendo tests de Autenticacion...
    call npm run test:auth
    goto end
)

if "%choice%"=="7" (
    echo.
    echo Abriendo modo UI...
    call npm run test:ui
    goto end
)

if "%choice%"=="8" (
    echo.
    echo Abriendo reporte...
    call npm run test:report
    goto end
)

if "%choice%"=="9" (
    echo.
    echo Saliendo...
    goto exit
)

echo.
echo Opcion invalida. Intenta de nuevo.
echo.
goto menu

:end
echo.
echo.
echo ========================================
echo   Tests completados
echo ========================================
echo.
pause
goto menu

:exit
