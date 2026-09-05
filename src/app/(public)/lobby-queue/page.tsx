'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Tv,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Stethoscope,
  Scissors,
  Clock,
  BellRing,
} from 'lucide-react';
import { queueApi } from '@/features/management/api/queue.api';
import type { LobbyQueueBoardDto, QueueTicketDto } from '@/types/clinic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function LobbyQueueDisplayPage() {
  const [board, setBoard] = useState<LobbyQueueBoardDto | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  // Track last announced ticket to prevent duplicate speech
  const lastAnnouncedIdRef = useRef<string | null>(null);

  // Digital Clock
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  // Web Audio Synthesized Chime (Ding-Dong)
  const playChime = () => {
    try {
      type WindowWithWebkitAudio = Window & { webkitAudioContext?: typeof AudioContext };
      const AudioContextClass =
        window.AudioContext || (window as WindowWithWebkitAudio).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      const playTone = (freq: number, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + duration);
      };

      // Dual-tone chime: High (784Hz - G5) then Low (523Hz - C5)
      playTone(784, 0, 0.6);
      playTone(523, 0.35, 0.9);
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  };

  // Vietnamese Voice Announcement
  const speakTicket = (ticket: QueueTicketDto) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // cancel previous
      const text = `Xin mời số thứ tự ${ticket.formattedTicket}, bé ${ticket.petName || 'thú cưng'}, đến ${ticket.roomCounter || 'quầy phục vụ'}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  };

  // Poll Lobby Board every 3 seconds
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const data = await queueApi.getLobbyBoard();
        setBoard(data);

        // Check if there is a newly called ticket
        if (data.lastCalledTicket && data.lastCalledTicket.id !== lastAnnouncedIdRef.current) {
          lastAnnouncedIdRef.current = data.lastCalledTicket.id;
          if (audioEnabled) {
            playChime();
            setTimeout(() => {
              speakTicket(data.lastCalledTicket!);
            }, 600);
          }
        }
      } catch (err) {
        console.error('Failed to poll lobby queue:', err);
      }
    };

    fetchBoard();
    const interval = setInterval(fetchBoard, 3000);
    return () => clearInterval(interval);
  }, [audioEnabled]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const clinic = board?.clinicLane;
  const spa = board?.spaLane;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 font-sans text-slate-100 antialiased selection:bg-rose-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="border-b border-slate-800 bg-slate-900/90 px-8 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 font-extrabold text-white shadow-lg shadow-rose-500/20 ring-4 ring-rose-500/20">
              <Tv className="size-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-white">VetiMate</h1>
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white">
                  MÀN HÌNH SẢNH CHỜ
                </Badge>
              </div>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                Hệ thống Bệnh viện & Spa Thú cưng Cao cấp
              </p>
            </div>
          </div>

          {/* Controls & Realtime Clock */}
          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                setAudioEnabled(!audioEnabled);
                if (!audioEnabled) {
                  playChime();
                }
              }}
              variant="outline"
              className={`rounded-2xl border-slate-700 transition ${
                audioEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="mr-2 size-4 text-emerald-400" />
                  <span className="text-xs font-bold">Loa gọi: BẬT</span>
                </>
              ) : (
                <>
                  <VolumeX className="mr-2 size-4" />
                  <span className="text-xs">Loa gọi: TẮT (Bấm để bật)</span>
                </>
              )}
            </Button>

            <Button
              onClick={toggleFullscreen}
              size="icon"
              variant="outline"
              className="rounded-2xl border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
            </Button>

            {/* Digital Clock */}
            {currentTime && (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-2.5 shadow-inner">
                <Clock className="size-6 text-rose-500" />
                <div className="text-right">
                  <div className="font-mono text-2xl font-black tracking-wider text-white">
                    {currentTime.toLocaleTimeString('vi-VN')}
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {currentTime.toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main 2-Lane Queue Content */}
      <main className="grid flex-1 gap-6 p-6 lg:grid-cols-2">
        {/* ================= LANE 1: KHÁM BỆNH ================= */}
        <div className="flex flex-col gap-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 to-emerald-950/20 p-6 shadow-2xl shadow-emerald-950/30">
          {/* Lane Header */}
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30">
                <Stethoscope className="size-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-emerald-400">PHÂN LUỒNG KHÁM BỆNH</h2>
                <p className="text-xs font-medium text-slate-400">Khám tổng quát, Siêu âm, Xét nghiệm & Cấp cứu</p>
              </div>
            </div>
            <Badge className="bg-emerald-500/20 px-3 py-1 font-bold text-emerald-300">
              Đang chờ: {clinic?.totalWaiting || 0}
            </Badge>
          </div>

          {/* NOW SERVING CARD */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-slate-950 p-8 shadow-2xl ring-4 ring-emerald-500/20">
            <div className="absolute right-0 top-0 -mr-8 -mt-8 size-48 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-emerald-300">
                <span className="size-2 animate-ping rounded-full bg-emerald-400" />
                ĐANG PHỤC VỤ (NOW SERVING)
              </span>
              <span className="text-sm font-semibold text-emerald-300">
                {clinic?.currentServing?.roomCounter || 'Phòng khám 01'}
              </span>
            </div>

            {clinic?.currentServing ? (
              <div className="mt-6 flex flex-col items-center justify-center text-center">
                <div className="font-mono text-7xl font-black tracking-widest text-white drop-shadow-[0_0_35px_rgba(16,185,129,0.5)]">
                  {clinic.currentServing.formattedTicket}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-2xl font-bold text-emerald-300">{clinic.currentServing.petName}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-lg text-slate-300">Chủ: {clinic.currentServing.customerName}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400">
                  <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                    {clinic.currentServing.serviceName}
                  </Badge>
                  {clinic.currentServing.doctorOrStaffName && (
                    <span className="text-slate-300">Bác sĩ: {clinic.currentServing.doctorOrStaffName}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-8 py-10 text-center text-xl font-bold text-slate-500">
                Hiện chưa có số nào đang khám
              </div>
            )}
          </div>

          {/* NEXT WAITING QUEUE LIST */}
          <div className="flex-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              SỐ TIẾP THEO ĐANG CHỜ ({clinic?.waitingList.length || 0})
            </h3>

            {clinic?.waitingList && clinic.waitingList.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {clinic.waitingList.slice(0, 6).map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-center transition hover:border-emerald-500/40"
                  >
                    <div className="font-mono text-2xl font-black text-emerald-400">{ticket.formattedTicket}</div>
                    <div className="mt-1 line-clamp-1 text-xs font-bold text-slate-200">{ticket.petName}</div>
                    <div className="line-clamp-1 text-[11px] text-slate-400">{ticket.customerName}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-center text-xs text-slate-500">
                Không có số nào đang chờ
              </div>
            )}
          </div>
        </div>

        {/* ================= LANE 2: SPA & GROOMING ================= */}
        <div className="flex flex-col gap-6 rounded-3xl border border-pink-500/30 bg-gradient-to-b from-slate-900/90 to-pink-950/20 p-6 shadow-2xl shadow-pink-950/30">
          {/* Lane Header */}
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-pink-500/20 text-pink-400 ring-2 ring-pink-500/30">
                <Scissors className="size-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-pink-400">PHÂN LUỒNG SPA & GROOMING</h2>
                <p className="text-xs font-medium text-slate-400">Tắm sấy, Cắt tỉa tạo kiểu, Vệ sinh móng tai</p>
              </div>
            </div>
            <Badge className="bg-pink-500/20 px-3 py-1 font-bold text-pink-300">
              Đang chờ: {spa?.totalWaiting || 0}
            </Badge>
          </div>

          {/* NOW SERVING CARD */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-pink-400 bg-gradient-to-br from-pink-900/40 via-slate-900 to-slate-950 p-8 shadow-2xl ring-4 ring-pink-500/20">
            <div className="absolute right-0 top-0 -mr-8 -mt-8 size-48 rounded-full bg-pink-500/10 blur-3xl" />

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 rounded-full bg-pink-500/20 px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-pink-300">
                <span className="size-2 animate-ping rounded-full bg-pink-400" />
                ĐANG PHỤC VỤ (NOW SERVING)
              </span>
              <span className="text-sm font-semibold text-pink-300">{spa?.currentServing?.roomCounter || 'Bàn Spa 01'}</span>
            </div>

            {spa?.currentServing ? (
              <div className="mt-6 flex flex-col items-center justify-center text-center">
                <div className="font-mono text-7xl font-black tracking-widest text-white drop-shadow-[0_0_35px_rgba(244,63,94,0.5)]">
                  {spa.currentServing.formattedTicket}
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <span className="text-2xl font-bold text-pink-300">{spa.currentServing.petName}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-lg text-slate-300">Chủ: {spa.currentServing.customerName}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400">
                  <Badge variant="outline" className="border-pink-500/40 bg-pink-500/10 text-pink-300">
                    {spa.currentServing.serviceName}
                  </Badge>
                  {spa.currentServing.doctorOrStaffName && (
                    <span className="text-slate-300">Kỹ thuật viên: {spa.currentServing.doctorOrStaffName}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-8 py-10 text-center text-xl font-bold text-slate-500">
                Hiện chưa có số nào đang spa
              </div>
            )}
          </div>

          {/* NEXT WAITING QUEUE LIST */}
          <div className="flex-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              SỐ TIẾP THEO ĐANG CHỜ ({spa?.waitingList.length || 0})
            </h3>

            {spa?.waitingList && spa.waitingList.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {spa.waitingList.slice(0, 6).map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex flex-col items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-center transition hover:border-pink-500/40"
                  >
                    <div className="font-mono text-2xl font-black text-pink-400">{ticket.formattedTicket}</div>
                    <div className="mt-1 line-clamp-1 text-xs font-bold text-slate-200">{ticket.petName}</div>
                    <div className="line-clamp-1 text-[11px] text-slate-400">{ticket.customerName}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-center text-xs text-slate-500">
                Không có số nào đang chờ
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Scrolling News & Care Tips Ticker */}
      <footer className="overflow-hidden border-t border-slate-800 bg-slate-900 px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex shrink-0 items-center gap-2 rounded-xl bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-400">
            <BellRing className="size-3.5 animate-bounce" />
            LƯU Ý DÀNH CHO KHÁCH HÀNG:
          </div>
          <div className="overflow-hidden whitespace-nowrap text-xs text-slate-300">
            <div className="inline-block animate-[marquee_25s_linear_infinite]">
              🐾 Quý khách vui lòng để mắt đến thú cưng và chuẩn bị di chuyển vào phòng khám / bàn spa khi tới số thứ
              tự. 🐾 Nếu thú cưng có triệu chứng cấp cứu hoặc sốt co giật, xin vui lòng báo ngay với quầy Lễ tân để được
              ưu tiên xử lý gấp. 🐾 VetiMate cam kết đem lại trải nghiệm chăm sóc y tế và spa tận tâm nhất!
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
