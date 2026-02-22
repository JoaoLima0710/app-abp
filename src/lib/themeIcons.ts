import {
    LucideIcon,
    Heart,
    Zap,
    Brain,
    Pill,
    Baby,
    Wine,
    Siren,
    Scale,
    Users,
    Apple,
    Globe,
    BookOpen,
    Dna,
    FileSearch,
    Activity,
    Stethoscope,
    Crosshair
} from 'lucide-react';
import { PsychiatryTheme } from '../types';

export const THEME_ICONS: Record<PsychiatryTheme, LucideIcon> = {
    transtornos_humor: Heart,
    transtornos_ansiedade: Zap,
    esquizofrenia_psicose: Brain,
    transtornos_personalidade: Activity, // Represnting varied behavior/mood instability
    psicofarmacologia: Pill,
    neurociencias: Dna,
    psiquiatria_infantojuvenil: Baby,
    psicogeriatria: Stethoscope,
    dependencia_quimica: Wine,
    psicopatologia_diagnostico: FileSearch,
    etica_forense_legal: Scale,
    urgencias_psiquiatricas: Siren,
    psicoterapia: Users,
    transtornos_alimentares: Apple,
    saude_publica: Globe,

    // Legados
    geral: BookOpen,
    diagnostico: Crosshair,
    etica_legal: Scale,
    psiquiatria_forense: Scale,
    neurociencias_diagnostico: Dna,
    psiquiatria_geriatrica: Stethoscope,
};
