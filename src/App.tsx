import React, { useState, useEffect, useRef } from 'react';
import { ScheduleData, Lesson, DaySchedule } from './types';
import { factoryData, rawManha, rawTarde, timeBounds } from './data';
import { Menu, Moon, Sun, Settings, Trash2, RotateCcw, Eye, EyeOff, Edit3, GripVertical, X, Check, Save, RefreshCw, Share2, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

const STORAGE_KEY = 'gestaoHorariosSchottz_v5';

export default function App() {
  // State
  const [appData, setAppData] = useState<ScheduleData>(() => JSON.parse(JSON.stringify(factoryData)));
  const [currentShift, setCurrentShift] = useState<'manha' | 'tarde'>('manha');
  const [currentClass, setCurrentClass] = useState<string>('');
  const [currentDay, setCurrentDay] = useState<string>('Segunda');
  const [isEditMode, setIsEditMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Modals State
  const [activeModal, setActiveModal] = useState<'edit' | 'system' | 'reset' | 'share' | null>(null);
  const [editModalData, setEditModalData] = useState<{index: number, lesson: Lesson} | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editTeacher, setEditTeacher] = useState('');
  
  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Progress Bar State
  const [currentTime, setCurrentTime] = useState(new Date());

  // Refs for capture
  const scheduleRef = useRef<HTMLDivElement>(null);

  // Initialization
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Migration check: If stored data has empty schedules (from previous bug), force reload from factoryData
      const hasManha = Object.keys(parsed.shifts.manha.schedules).length > 0;
      if (!hasManha) {
        console.log("Empty schedules detected in storage. Migrating to factory data.");
        setAppData(JSON.parse(JSON.stringify(factoryData)));
      } else {
        setAppData(parsed);
      }
    } else {
      setAppData(JSON.parse(JSON.stringify(factoryData)));
    }

    // Set initial day
    const nameMap: Record<number, string> = { 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta' };
    const today = new Date().getDay();
    if (nameMap[today]) {
      setCurrentDay(nameMap[today]);
    }
  }, []);

  // Set initial class when data or shift changes
  useEffect(() => {
    const classes = appData.shifts[currentShift].classesList;
    if (classes.length > 0 && (!currentClass || !classes.includes(currentClass))) {
      setCurrentClass(classes[0]);
    }
  }, [appData, currentShift]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
    document.body.setAttribute('data-theme', appData.config.theme);
  }, [appData]);

  // Timer for progress bar
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleSchoolNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppData(prev => ({ ...prev, config: { ...prev.config, schoolName: e.target.value } }));
  };

  const toggleTheme = () => {
    setAppData(prev => ({ ...prev, config: { ...prev.config, theme: prev.config.theme === 'dark' ? 'light' : 'dark' } }));
    setMenuOpen(false);
  };

  const addClass = (newClass: string) => {
    if (!newClass.trim()) return;
    if (appData.shifts[currentShift].classesList.includes(newClass)) {
      alert("Turma já existe!");
      return;
    }
    
    const newData = JSON.parse(JSON.stringify(appData));
    newData.shifts[currentShift].classesList.push(newClass);
    
    const newWeek: Record<string, Lesson[]> = {};
    ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].forEach(d => {
      newWeek[d] = [];
      for (let i = 0; i < 7; i++) {
        if (i === 3) newWeek[d].push({ s: "INTERVALO", t: "", state: "interval", hidden: false, tempS: null, tempT: null, origIdx: i });
        else newWeek[d].push({ s: "", t: "", state: "normal", hidden: false, tempS: null, tempT: null, origIdx: i });
      }
    });
    
    newData.shifts[currentShift].schedules[newClass] = newWeek;
    setAppData(newData);
  };

  const deleteClass = (cls: string) => {
    if (!confirm(`Excluir permanentemente a turma ${cls}?`)) return;
    const newData = JSON.parse(JSON.stringify(appData));
    newData.shifts[currentShift].classesList = newData.shifts[currentShift].classesList.filter((c: string) => c !== cls);
    delete newData.shifts[currentShift].schedules[cls];
    setAppData(newData);
    if (currentClass === cls) setCurrentClass(newData.shifts[currentShift].classesList[0] || '');
  };

  const resetApp = (keepManual: boolean) => {
    if (keepManual) {
      const customClasses: any = { manha: {}, tarde: {} };
      ['manha', 'tarde'].forEach(sh => {
        appData.shifts[sh].classesList.forEach(cls => {
          if (!factoryData.shifts[sh].classesList.includes(cls)) {
            customClasses[sh][cls] = appData.shifts[sh].schedules[cls];
          }
        });
      });

      const initialData = JSON.parse(JSON.stringify(factoryData));

      ['manha', 'tarde'].forEach(sh => {
        for (let cls in customClasses[sh]) {
          initialData.shifts[sh].classesList.push(cls);
          initialData.shifts[sh].schedules[cls] = customClasses[sh][cls];
        }
      });
      setAppData(initialData);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
    setActiveModal(null);
  };

  const clearMoves = () => {
    if (!confirm("Remover todas as alterações temporárias, aulas adiantadas e ocultas de HOJE?")) return;
    const newData = JSON.parse(JSON.stringify(appData));
    const daySchedule = newData.shifts[currentShift].schedules[currentClass][currentDay];
    
    // Sort by original index to restore positions
    daySchedule.sort((a: any, b: any) => a.origIdx - b.origIdx);
    
    daySchedule.forEach((l: any) => {
      if (l.state !== 'interval') {
        l.state = 'normal';
        l.hidden = false;
        l.tempS = null;
        l.tempT = null;
      }
    });
    setAppData(newData);
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isEditMode) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    if (!isEditMode || draggedIndex === null) return;
    e.stopPropagation();
    
    const newData = JSON.parse(JSON.stringify(appData));
    const daySchedule = newData.shifts[currentShift].schedules[currentClass][currentDay];
    
    if (draggedIndex === targetIndex || daySchedule[targetIndex].state === 'interval') {
      setDraggedIndex(null);
      return;
    }

    // Swap
    const temp = daySchedule[draggedIndex];
    daySchedule[draggedIndex] = daySchedule[targetIndex];
    daySchedule[targetIndex] = temp;
    
    daySchedule[targetIndex].state = 'moved';
    
    setAppData(newData);
    setDraggedIndex(null);
  };

  // Sharing Logic
  const handleShare = async () => {
    if (!scheduleRef.current) return;

    try {
      // Temporarily remove some UI elements for cleaner capture if needed
      // But for now we capture what is seen
      
      const canvas = await html2canvas(scheduleRef.current, {
        backgroundColor: appData.config.theme === 'dark' ? '#111827' : '#F3F4F6',
        scale: 2 // Higher quality
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], `horario-${currentClass}-${currentDay}.png`, { type: 'image/png' });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `Horário ${currentClass} - ${currentDay}`,
              text: `Confira o horário da turma ${currentClass} para ${currentDay}.`
            });
          } catch (error) {
            console.error('Error sharing:', error);
          }
        } else {
          // Fallback: Download
          const link = document.createElement('a');
          link.download = `horario-${currentClass}-${currentDay}.png`;
          link.href = canvas.toDataURL();
          link.click();
          alert('Imagem salva! Você pode enviá-la pelo WhatsApp.');
        }
      });
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Erro ao gerar imagem.');
    }
    setMenuOpen(false);
  };

  // Render Helpers
  const getProgress = (start: string, end: string) => {
    const nameMap = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const todayStr = nameMap[new Date().getDay()];
    if (todayStr !== currentDay) return 0;

    const now = currentTime;
    const currentMins = now.getHours() * 60 + now.getMinutes();
    
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;

    if (currentMins >= startMins && currentMins < endMins) {
      return ((currentMins - startMins) / (endMins - startMins)) * 100;
    }
    return currentMins >= endMins ? 100 : 0;
  };

  const isActiveClass = (start: string, end: string) => {
    const p = getProgress(start, end);
    return p > 0 && p < 100;
  };

  // Autocomplete lists
  const getAutocompleteLists = () => {
    const subjects = new Set<string>();
    const teachers = new Set<string>();
    
    // Add from current app data
    ['manha', 'tarde'].forEach(sh => {
      const shift = appData.shifts[sh];
      if (!shift) return;
      for (let c in shift.schedules) {
        for (let d in shift.schedules[c]) {
          shift.schedules[c][d].forEach(l => {
            if (l.s && l.state !== 'interval') subjects.add(l.s);
            if (l.tempS) subjects.add(l.tempS);
            if (l.t) teachers.add(l.t);
            if (l.tempT) teachers.add(l.tempT);
          });
        }
      }
    });

    // Also add from raw data to ensure nothing is lost even if not currently scheduled
    // This addresses "Manter professores e matérias"
    const processRaw = (raw: any) => {
        for (let c in raw) {
            for (let d in raw[c]) {
                raw[c][d].forEach((item: any) => {
                    if (item[0] !== "INT") {
                        subjects.add(item[0]);
                        if (item[1]) teachers.add(item[1]);
                    }
                });
            }
        }
    };
    processRaw(rawManha);
    processRaw(rawTarde);

    return { subjects: Array.from(subjects).sort(), teachers: Array.from(teachers).sort() };
  };

  const { subjects, teachers } = getAutocompleteLists();

  // Render
  if (!appData) return <div>Loading...</div>;

  const schedule = appData.shifts[currentShift].schedules[currentClass]?.[currentDay] || [];
  const times = appData.shifts[currentShift].times;
  const boundsData = timeBounds[currentShift];

  // Calculate bounds
  let startBound = "--:--";
  let endBound = "--:--";
  let alteredStart = false;
  let alteredEnd = false;

  if (schedule.length > 0) {
    let firstIndex = -1, lastIndex = -1;
    for (let i = 0; i < schedule.length; i++) {
      if (schedule[i].state !== 'interval' && !schedule[i].hidden) {
        if (firstIndex === -1) firstIndex = i;
        lastIndex = i;
      }
    }
    if (firstIndex !== -1) {
      startBound = boundsData[firstIndex].start;
      endBound = boundsData[lastIndex].end;
      alteredStart = boundsData[firstIndex].start !== boundsData[0].start;
      alteredEnd = boundsData[lastIndex].end !== boundsData[boundsData.length - 1].end;
    }
  }

  return (
    <div className={`app-container ${isEditMode ? 'editing-mode' : ''}`}>
      {/* Header */}
      <header>
        <div className="header-top">
          <input 
            type="text" 
            className="school-name" 
            value={appData.config.schoolName}
            onChange={handleSchoolNameChange}
          />
          <div className="menu-container">
            <button className="btn-menu" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu />
            </button>
            <div className={`dropdown-content ${menuOpen ? 'show' : ''}`}>
              <button onClick={handleShare}>
                <Share2 size={18} />
                Compartilhar Horário
              </button>
              <button onClick={toggleTheme}>
                {appData.config.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                Alternar Tema
              </button>
              <button onClick={() => { setActiveModal('system'); setMenuOpen(false); }}>
                <Settings size={18} />
                Gerenciar Turmas
              </button>
              <button onClick={() => { setActiveModal('reset'); setMenuOpen(false); }} style={{ color: 'var(--danger)' }}>
                <RotateCcw size={18} />
                Resetar Aplicativo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="controls-section">
        <div className="shift-selector">
          <button 
            className={`btn-shift ${currentShift === 'manha' ? 'active' : ''}`}
            onClick={() => setCurrentShift('manha')}
          >
            Manhã
          </button>
          <button 
            className={`btn-shift ${currentShift === 'tarde' ? 'active' : ''}`}
            onClick={() => setCurrentShift('tarde')}
          >
            Tarde
          </button>
        </div>

        <div className="class-selector">
          {appData.shifts[currentShift].classesList.map(cls => (
            <button 
              key={cls}
              className={`btn-class ${currentClass === cls ? 'active' : ''}`}
              onClick={() => setCurrentClass(cls)}
            >
              {cls}
            </button>
          ))}
        </div>

        <div className="day-selector">
          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map(day => (
            <button 
              key={day}
              className={`btn-day ${currentDay === day ? 'active' : ''}`}
              onClick={() => setCurrentDay(day)}
            >
              {day.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Edit Toggle */}
      <div className="edit-toggle-container">
        <button 
          className={`btn-toggle-edit ${isEditMode ? 'active' : ''}`}
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {isEditMode ? <Edit3 size={18} /> : <Eye size={18} />}
          {isEditMode ? 'Modo Edição Ativado' : 'Ativar Modo Edição'}
        </button>
      </div>

      {isEditMode && (
        <div className="edit-tools">
          <button className="btn-clear-moves" onClick={clearMoves}>
            <RefreshCw size={16} style={{display: 'inline', marginRight: 5}}/>
            Restaurar Posições e Ocultos (Dia Atual)
          </button>
        </div>
      )}

      {/* Main Content to Capture */}
      <div id="schedule-capture-area" ref={scheduleRef} style={{ padding: '5px', borderRadius: '8px', backgroundColor: appData.config.theme === 'dark' ? '#111827' : '#F3F4F6' }}>
        {/* Bounds Header */}
        <div className="day-bounds-header">
          <div className={`bound-item ${alteredStart ? 'altered' : ''}`}>
            <span className="bound-label">{alteredStart ? 'Entrada Alterada' : 'Entrada'}</span>
            <span className="bound-val">{startBound}</span>
          </div>
          <div className="bounds-divider"></div>
          <div className={`bound-item ${alteredEnd ? 'altered' : ''}`}>
            <span className="bound-label">{alteredEnd ? 'Saída Antecipada' : 'Saída'}</span>
            <span className="bound-val">{endBound}</span>
          </div>
        </div>

        {/* Schedule List */}
        <div className="schedule-list">
          {schedule.map((lesson, index) => {
            if (!isEditMode && lesson.hidden) return null;

            const currentSubj = lesson.tempS !== null ? lesson.tempS : lesson.s;
            const currentTeach = lesson.tempT !== null ? lesson.tempT : lesson.t;
            const isVaga = !currentSubj?.trim();
            const isHidden = lesson.hidden;
            const isTemp = lesson.tempS !== null || lesson.state === 'moved';
            const isInterval = lesson.state === 'interval';

            let cardClass = 'class-card';
            if (isInterval) cardClass += ' intervalo';
            else if (isHidden) cardClass += ' hidden-lesson';
            else if (isVaga) cardClass += ' vaga';
            else if (isTemp) cardClass += ' adiantada';
            
            if (draggedIndex === index) cardClass += ' dragging';
            if (isActiveClass(boundsData[index].start, boundsData[index].end) && !isInterval) cardClass += ' active-class';

            return (
              <div 
                key={index}
                className={cardClass}
                style={{ '--progress': `${getProgress(boundsData[index].start, boundsData[index].end)}%` } as React.CSSProperties}
                draggable={isEditMode && !isInterval}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                {isInterval ? (
                  <>
                    <div className="time-col">
                      <span className="time-start">{boundsData[index].start}</span>
                      <span className="time-end">{boundsData[index].end}</span>
                    </div>
                    <div className="intervalo-text">Recreio / Lanche</div>
                  </>
                ) : (
                  <>
                    <div className="drag-handle" title="Segure para Arrastar">
                      <GripVertical size={20} />
                    </div>
                    <div className="time-col">
                      <span className="time-start">{boundsData[index].start}</span>
                      <span className="time-end">{boundsData[index].end}</span>
                    </div>
                    <div className="info-col">
                      <div className="subject">{currentSubj || '---'}</div>
                      <div className="teacher">{currentTeach && !isHidden ? `(${currentTeach})` : ''}</div>
                      {isHidden && <div className="badge badge-hidden">❌ CANCELADA</div>}
                      {!isHidden && isVaga && <div className="badge badge-vaga">⚠️ AULA VAGA</div>}
                      {!isHidden && !isVaga && isTemp && <div className="badge badge-adiantada">🔄 MODIFICADA HOJE</div>}
                    </div>
                    <div className="card-controls">
                      <button className="btn-ctrl" onClick={() => {
                          const newData = JSON.parse(JSON.stringify(appData));
                          newData.shifts[currentShift].schedules[currentClass][currentDay][index].tempS = "";
                          newData.shifts[currentShift].schedules[currentClass][currentDay][index].tempT = "";
                          setAppData(newData);
                      }} title="Aula Vaga">
                        <Trash2 size={16} />
                      </button>
                      <button className="btn-ctrl" onClick={() => {
                          setEditModalData({ index, lesson });
                          setEditSubject(lesson.tempS !== null ? lesson.tempS : lesson.s);
                          setEditTeacher(lesson.tempT !== null ? lesson.tempT : lesson.t);
                          setActiveModal('edit');
                      }} title="Editar">
                        <Edit3 size={16} />
                      </button>
                      <button className="btn-ctrl" onClick={() => {
                          const newData = JSON.parse(JSON.stringify(appData));
                          newData.shifts[currentShift].schedules[currentClass][currentDay][index].hidden = !lesson.hidden;
                          setAppData(newData);
                      }} title="Ocultar">
                        {isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'edit' && editModalData && (
        <div className="modal-overlay show">
          <div className="modal">
            <h3>Editar Aula</h3>
            <div className="form-group">
              <label>Matéria (Deixe em branco p/ Vaga)</label>
              <input 
                type="text" 
                className="form-input" 
                list="subjects-list" 
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Professor(a)</label>
              <input 
                type="text" 
                className="form-input" 
                list="teachers-list" 
                value={editTeacher}
                onChange={(e) => setEditTeacher(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-modal btn-cancel" onClick={() => setActiveModal(null)}>Cancelar</button>
              <button className="btn-modal btn-save-temp" onClick={() => {
                  const newData = JSON.parse(JSON.stringify(appData));
                  const l = newData.shifts[currentShift].schedules[currentClass][currentDay][editModalData.index];
                  l.tempS = editSubject;
                  l.tempT = editTeacher;
                  setAppData(newData);
                  setActiveModal(null);
              }}>Salvar Só p/ Hoje</button>
              <button className="btn-modal btn-save" onClick={() => {
                  const newData = JSON.parse(JSON.stringify(appData));
                  const l = newData.shifts[currentShift].schedules[currentClass][currentDay][editModalData.index];
                  l.s = editSubject;
                  l.t = editTeacher;
                  l.tempS = null;
                  l.tempT = null;
                  l.state = 'normal';
                  setAppData(newData);
                  setActiveModal(null);
              }}>Salvar Fixo</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'system' && (
        <div className="modal-overlay show">
          <div className="modal">
            <h3>⚙️ Gerenciar Turmas</h3>
            <div className="form-group">
              <label>Adicionar Turma ({currentShift === 'manha' ? 'Manhã' : 'Tarde'})</label>
              <div className="add-class-box">
                <input type="text" id="new-class-input" className="form-input" placeholder="Ex: 903" />
                <button className="btn-modal btn-save" onClick={() => {
                    const val = (document.getElementById('new-class-input') as HTMLInputElement).value;
                    addClass(val);
                    (document.getElementById('new-class-input') as HTMLInputElement).value = '';
                }}>Add</button>
              </div>
            </div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: 5, display: 'block' }}>
              Turmas Existentes
            </label>
            <div className="class-list-edit">
              {appData.shifts[currentShift].classesList.map(cls => (
                <div key={cls} className="class-edit-item">
                  <span>Turma <b>{cls}</b></span>
                  <button className="btn-ctrl" onClick={() => deleteClass(cls)} style={{ border: 'none', color: 'var(--danger)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button className="btn-modal btn-cancel" style={{ width: '100%' }} onClick={() => setActiveModal(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'reset' && (
        <div className="modal-overlay show">
          <div className="modal">
            <h3>⚠️ Reset Global</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Esta ação apaga todas as modificações e adiantamentos, restaurando a grade original de fábrica.
            </p>
            <div className="checkbox-group">
              <input type="checkbox" id="keep-manual-classes" defaultChecked />
              <label htmlFor="keep-manual-classes">Manter turmas adicionadas manualmente?</label>
            </div>
            <button className="btn-modal btn-danger" onClick={() => {
                const keep = (document.getElementById('keep-manual-classes') as HTMLInputElement).checked;
                resetApp(keep);
            }}>🧨 CONFIRMAR RESET</button>
            <button className="btn-modal btn-cancel" style={{ width: '100%', marginTop: 10 }} onClick={() => setActiveModal(null)}>Cancelar</button>
          </div>
        </div>
      )}

      <datalist id="subjects-list">
        {subjects.map(s => <option key={s} value={s} />)}
      </datalist>
      <datalist id="teachers-list">
        {teachers.map(t => <option key={t} value={t} />)}
      </datalist>
    </div>
  );
}
