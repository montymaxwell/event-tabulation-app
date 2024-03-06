revoke delete on table "public"."clients" from "anon";

revoke insert on table "public"."clients" from "anon";

revoke references on table "public"."clients" from "anon";

revoke select on table "public"."clients" from "anon";

revoke trigger on table "public"."clients" from "anon";

revoke truncate on table "public"."clients" from "anon";

revoke update on table "public"."clients" from "anon";

revoke delete on table "public"."clients" from "authenticated";

revoke insert on table "public"."clients" from "authenticated";

revoke references on table "public"."clients" from "authenticated";

revoke select on table "public"."clients" from "authenticated";

revoke trigger on table "public"."clients" from "authenticated";

revoke truncate on table "public"."clients" from "authenticated";

revoke update on table "public"."clients" from "authenticated";

revoke delete on table "public"."clients" from "service_role";

revoke insert on table "public"."clients" from "service_role";

revoke references on table "public"."clients" from "service_role";

revoke select on table "public"."clients" from "service_role";

revoke trigger on table "public"."clients" from "service_role";

revoke truncate on table "public"."clients" from "service_role";

revoke update on table "public"."clients" from "service_role";

revoke delete on table "public"."events" from "anon";

revoke insert on table "public"."events" from "anon";

revoke references on table "public"."events" from "anon";

revoke select on table "public"."events" from "anon";

revoke trigger on table "public"."events" from "anon";

revoke truncate on table "public"."events" from "anon";

revoke update on table "public"."events" from "anon";

revoke delete on table "public"."events" from "authenticated";

revoke insert on table "public"."events" from "authenticated";

revoke references on table "public"."events" from "authenticated";

revoke select on table "public"."events" from "authenticated";

revoke trigger on table "public"."events" from "authenticated";

revoke truncate on table "public"."events" from "authenticated";

revoke update on table "public"."events" from "authenticated";

revoke delete on table "public"."events" from "service_role";

revoke insert on table "public"."events" from "service_role";

revoke references on table "public"."events" from "service_role";

revoke select on table "public"."events" from "service_role";

revoke trigger on table "public"."events" from "service_role";

revoke truncate on table "public"."events" from "service_role";

revoke update on table "public"."events" from "service_role";

revoke delete on table "public"."scores" from "anon";

revoke insert on table "public"."scores" from "anon";

revoke references on table "public"."scores" from "anon";

revoke select on table "public"."scores" from "anon";

revoke trigger on table "public"."scores" from "anon";

revoke truncate on table "public"."scores" from "anon";

revoke update on table "public"."scores" from "anon";

revoke delete on table "public"."scores" from "authenticated";

revoke insert on table "public"."scores" from "authenticated";

revoke references on table "public"."scores" from "authenticated";

revoke select on table "public"."scores" from "authenticated";

revoke trigger on table "public"."scores" from "authenticated";

revoke truncate on table "public"."scores" from "authenticated";

revoke update on table "public"."scores" from "authenticated";

revoke delete on table "public"."scores" from "service_role";

revoke insert on table "public"."scores" from "service_role";

revoke references on table "public"."scores" from "service_role";

revoke select on table "public"."scores" from "service_role";

revoke trigger on table "public"."scores" from "service_role";

revoke truncate on table "public"."scores" from "service_role";

revoke update on table "public"."scores" from "service_role";

alter table "public"."clients" drop constraint "clients_user_fkey";

alter table "public"."events" drop constraint "events_owner_fkey";

alter table "public"."scores" drop constraint "scores_event_fkey";

alter table "public"."clients" drop constraint "client_pkey";

alter table "public"."events" drop constraint "events_pkey";

alter table "public"."scores" drop constraint "scores_pkey";

drop index if exists "public"."client_pkey";

drop index if exists "public"."events_pkey";

drop index if exists "public"."scores_pkey";

drop table "public"."clients";

drop table "public"."events";

drop table "public"."scores";


