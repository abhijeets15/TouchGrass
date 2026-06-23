#!/usr/bin/env bash
# Start Expo with your Mac's LAN IP so physical phones can connect.
# Compatible with macOS default bash 3.2.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

collect_ips() {
  ifconfig 2>/dev/null | awk '/inet / && $2 != "127.0.0.1" {print $2}'
}

IP=""
ALL_IPS=""

if [[ -n "${MOBILE_LAN_IP:-}" ]]; then
  IP="$MOBILE_LAN_IP"
else
  PREFERRED=""
  FALLBACK=""
  while IFS= read -r addr; do
    ALL_IPS="${ALL_IPS:+$ALL_IPS }$addr"
    if [[ "$addr" == 192.168.* ]]; then
      PREFERRED="$addr"
    fi
    if [[ -z "$FALLBACK" ]]; then
      FALLBACK="$addr"
    fi
  done < <(collect_ips)

  if [[ -n "$PREFERRED" ]]; then
    IP="$PREFERRED"
  elif [[ -n "$FALLBACK" ]]; then
    IP="$FALLBACK"
  else
    for iface in en0 en1 en2; do
      IP="$(ipconfig getifaddr "$iface" 2>/dev/null || true)"
      if [[ -n "$IP" && "$IP" != 127.0.0.1 ]]; then
        break
      fi
    done
  fi
fi

if [[ -z "$IP" ]]; then
  echo "Could not detect your LAN IP."
  echo "Set it manually: MOBILE_LAN_IP=192.168.1.5 npm run mobile:device"
  echo "Or use tunnel:      npm run mobile:tunnel"
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Vibecheck — Expo for physical device"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Mac IP:     $IP"
echo "  Expo URL:   exp://${IP}:8081"
echo "  Auth API:   http://${IP}:3001  (keep 'npm run api' running)"
echo ""
if [[ -n "$ALL_IPS" ]]; then
  echo "  All Mac IPs: $ALL_IPS"
  echo "  Override:    MOBILE_LAN_IP=x.x.x.x npm run mobile:device"
  echo ""
fi
echo "  1. Phone and Mac on the SAME Wi-Fi (not guest network)"
echo "  2. Open Expo Go → Scan QR code (not iPhone Camera)"
echo "  3. If it still fails: npm run mobile:tunnel"
echo ""
echo "  macOS Firewall? System Settings → Network → Firewall"
echo "  → allow Node / Terminal incoming connections"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

export REACT_NATIVE_PACKAGER_HOSTNAME="$IP"
cd "$ROOT/apps/mobile"
exec npx expo start --clear --lan
