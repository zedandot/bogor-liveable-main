"use client";

import { FormEvent, useState } from "react";
import { Header, Icon } from "../components/ui";

type Message={role:"user"|"bot";text:string};
const examples=["Kelurahan mana yang paling jauh dari rumah sakit?","Bandingkan Bantarjati dengan Pasir Mulya.","Apa arti kelas Cukup Layak Huni?","Kecamatan mana yang lingkungannya terbaik?"];

export default function AssistantPage(){
  const [messages,setMessages]=useState<Message[]>([]);
  const [input,setInput]=useState("");
  const ask=(text:string)=>{if(!text.trim())return;setMessages([...messages,{role:"user",text},{role:"bot",text:"Berdasarkan data 2026, Bantarjati memiliki skor kelayakhunian 0,86 dan berada pada peringkat pertama. Keunggulan utamanya ada pada dimensi kesehatan (0,88) dan lingkungan (0,82)."}]);setInput("")};
  const submit=(e:FormEvent)=>{e.preventDefault();ask(input)};
  return <div className="assistant-page"><Header/><main><aside className="assistant-aside"><div><span className="assistant-orb"><Icon name="bot" size={28}/></span><p className="eyebrow">Asisten data</p><h1>Tanya Bogor</h1><p>Temukan jawaban dari data kelayakhunian 68 kelurahan Kota Bogor.</p></div><div className="assistant-scope"><b>Yang dapat saya bantu</b><span><Icon name="check"/>Skor dan peringkat wilayah</span><span><Icon name="check"/>Penjelasan indikator</span><span><Icon name="check"/>Perbandingan kelurahan</span><span><Icon name="check"/>Sumber dan tahun data</span></div><small><Icon name="info" size={15}/>Jawaban hanya mencakup kelayakhunian Kota Bogor dan tidak mengubah data.</small></aside>
    <section className="chat-stage">{messages.length===0?<div className="chat-empty"><div className="rain-rings"><i/><i/><i/><Icon name="rain" size={34}/></div><h2>Apa yang ingin Anda ketahui?</h2><p>Saya menjawab berdasarkan data yang tersimpan di Ruang Bogor, bukan dari ingatan umum.</p><div className="prompt-examples">{examples.map(x=><button key={x} onClick={()=>ask(x)}>{x}<Icon name="arrow" size={15}/></button>)}</div></div>:<div className="message-list"><div className="chat-date">Hari ini</div>{messages.map((m,i)=><div className={"message "+m.role} key={i}>{m.role==="bot"&&<span><Icon name="bot" size={16}/></span>}<div>{m.text}{m.role==="bot"&&<small>Sumber: indeks kelayakhunian 2026 · Data olahan tim</small>}</div></div>)}</div>}
      <form className="chat-input" onSubmit={submit}><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Tanyakan tentang kelayakhunian Kota Bogor..." aria-label="Pertanyaan"/><button aria-label="Kirim pertanyaan"><Icon name="arrow"/></button><small>Tekan Enter untuk mengirim · Asisten dapat melakukan kesalahan, periksa sumber data.</small></form></section>
  </main></div>;
}
