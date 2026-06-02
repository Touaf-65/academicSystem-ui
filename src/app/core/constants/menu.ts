
import {MenuItem} from "../models/menu.model";

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Base',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Dashboard',
          route: '/dashboard',
          children: [{ label: "Vue d'ensemble", route: '/dashboard/vue' }],
        },
        {
          icon: '/assets/icons/heroicons/outline/lock-closed.svg',
          label: 'Auth',
          route: '/auth',
          children: [
            { label: 'Sign in', route: '/auth/sign-in' },
            { label: 'Sign up', route: '/auth/sign-up' },
            { label: 'Forgot Password', route: '/auth/forgot-password' },
            { label: 'New Password', route: '/auth/new-password' },
          ],
        },
      ],
    },
    {
      group: 'Structure Academique',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Départements',
          route: '/departments',
        },
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Programmes',
          route: '/departments/programs',
        },
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Cycles',
          route: '/departments/cycles',
        },
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Niveaux',
          route: '/departments/levels',
        },
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Classes',
          route: '/departments/classrooms',
        },
      ],
    },
    {
      group: 'Salles & Infrastructures',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: "Vue d'ensemble",
          route: '/infrastructures',
        },
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Bâtiments & Etages',
          route: '/infrastructures/build-floors',
        },
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Salles',
          route: '/infrastructures/classrooms',
        },
      ],
    },
    {
      group: 'Cours',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: "Vue d'ensemble",
          route: '/courses',
        },
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Cours',
          route: '/courses/list',
        },
      ],
    },
    {
      group: 'Enseignants',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Vue',
          route: '/teachers/vue',
        },
      ],
    },
    {
      group: 'Suivi de Scolarité',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Vue',
          route: '/schooling/vue',
        },
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Etudiants',
          route: '/schooling/students',
        },
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Inscriptions',
          route: '/schooling/enrollments',
        },
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Groupes d\'étudiants',
          route: '/schooling/groups',
        },
      ],
    },
    {
      group: 'Emploi du temps',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'vue',
          route: '/planning/vue',
        },
      ],
    },
    {
      group: 'Paiements',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'vue',
          route: '/payment/vue',
        },
      ],
    },
    {
      group: 'Configuration',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'vue',
          route: '/config/vue',
        },
      ],
    },
    // {
    //   group: 'Echéances',
    //   separator: false,
    //   items: [
    //     {
    //       icon: '/assets/icons/heroicons/outline/chart-pie.svg',
    //       label: 'Echéances',
    //       route: 'dashboard/echeance',
    //     },
    //   ],
    // },
    // {
    //   group: 'Journal',
    //   separator: false,
    //   items: [
    //     {
    //       icon: '/assets/icons/heroicons/outline/chart-pie.svg',
    //       label: 'Journal de Bord',
    //       route: 'dashboard/journal',
    //     },
    //   ],
    // },
    // {
    //   group: 'Entreprise',
    //   separator: false,
    //   items: [
    //     {
    //       icon: '/assets/icons/heroicons/outline/chart-pie.svg',
    //       label: 'Entreprise',
    //       route: 'dashboard/entreprise',
    //     },
    //   ],
    // },
    // {
    //   group: 'Profile',
    //   separator: false,
    //   items: [
    //     {
    //       icon: '/assets/icons/heroicons/outline/chart-pie.svg',
    //       label: 'Profile',
    //       route: 'dashboard/profile',
    //     },
    //   ],
    // },
  ];
}
