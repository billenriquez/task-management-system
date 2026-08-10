import Header from "@/components/HomeHeader";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LayoutDashboard, Users2, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<main className="min-h-screen bg-slate-50">
			<Header />
			<section className="overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-sky-800 text-white">
				<div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
					<div><span className="rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-sm text-sky-100">Plan clearly. Work confidently.</span><h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl">Move work forward without losing the details.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">TaskMate brings projects, tasks, teams, and progress into one focused workspace built for everyday collaboration.</p><div className="mt-8 flex flex-wrap gap-3"><Button size="lg" asChild><Link href="/auth/register">Create an account <ArrowRight className="ml-2 h-4 w-4" /></Link></Button><Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white" asChild><Link href="/auth/login">Sign in</Link></Button></div></div>
					<div className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur"><div className="rounded-xl bg-white p-6 text-slate-900"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-500">Workspace overview</p><p className="text-2xl font-semibold">Good morning 👋</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">On track</span></div><div className="mt-6 grid grid-cols-3 gap-3">{[["12","Projects"],["28","In progress"],["47","Completed"]].map(([n,l])=><div key={l} className="rounded-lg bg-slate-100 p-3"><p className="text-2xl font-bold">{n}</p><p className="text-xs text-slate-500">{l}</p></div>)}</div><div className="mt-5 space-y-3">{["Finalize responsive navigation","Review authentication flow","Test webhook retries"].map((task,i)=><div key={task} className="flex items-center gap-3 rounded-lg border p-3"><CheckCircle2 className={i===0?"text-emerald-500":"text-slate-300"}/><span className="text-sm">{task}</span></div>)}</div></div></div>
				</div>
			</section>
			<section className="mx-auto max-w-7xl px-6 py-20"><div className="grid gap-6 md:grid-cols-3">{[[LayoutDashboard,"One clear workspace","See priorities and progress without jumping between disconnected tools."],[Workflow,"Practical task tracking","Organize assignments, due dates, and project status in a consistent workflow."],[Users2,"Team visibility","Keep responsibilities visible so everyone knows what needs attention."]].map(([Icon,title,text]: any)=><div key={title} className="rounded-xl border bg-white p-6 shadow-sm"><Icon className="h-8 w-8 text-blue-600"/><h2 className="mt-4 text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></div>)}</div></section>
		</main>
	);
}
